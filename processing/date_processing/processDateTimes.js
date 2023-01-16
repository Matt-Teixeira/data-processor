const { log } = require("../../logger");
const generateDateTime = require("./generateDateTimes");
const { updateDateTime } = require("../../sql/qf-provider");

async function processDateTimes(redisClient) {
  // Maps current redis pg_table data to new schema
  table_keys = {
    mmb_siemens_non_tim: "mmb.siemens_non_tim",
    mmb_siemens: "mmb.siemens",
    mmb_ge_mm3: "mmb.ge_mm3",
    mmb_ge_mm4: "mmb.ge_mm4",
  };

  try {
    const key = "dp:queue";
    const queueLength = await redisClient.sendCommand(["LLEN", key]);

    for (let i = 0; i < queueLength; i++) {
      const reading = await redisClient.sendCommand(["RPOP", key]);

      // Place back in queue: if error, will not lose data.
      await redisClient.sendCommand(["LPUSH", key, reading]);

      await log("info", "uuid", "sme", "processDateTimes", "FN DETAILS", {
        reading: reading,
      });

      //await redisClient.sendCommand(["LPUSH", key, reading]);

      /**** PROCESS DATE ****/

      const queueData = await JSON.parse(reading);

      let prev_date = "";
      let prev_time = "";
      let current_date = queueData.host_date;
      let current_time = queueData.host_time;

      if (current_date === prev_date && current_time === prev_time) {
        await redisClient.sendCommand(["LPOP", key]);
        continue;
      }

      prev_date = current_date;
      prev_time = current_time;

      const dtObject = await generateDateTime(
        "uuid",
        queueData.system_id,
        queueData.pg_table,
        queueData.host_date,
        queueData.host_time
      );

      if (dtObject === null || dtObject === undefined) {
        await log("warn", "uuid", "sme", "processDateTimes", "FN DETAILS", {
          message: "date_time object was null/undefined",
        });
        continue;
      }

      const updatedDb = await updateDateTime("TEST", [
        queueData.pg_table, //table_keys[queueData.pg_table]
        dtObject,
        queueData.system_id,
        queueData.host_date,
        queueData.host_time,
      ]);

      if (updatedDb) {
        // If data processing completes, remove reading from head of list
        // console.log("LPOPPING");
        await redisClient.sendCommand(["LPOP", key]);
      }
    }
    /**** PROCESS DATE ****/

    await redisClient.quit();
  } catch (error) {
    await redisClient.quit();
    console.log(error);
    await log("error", "uuid", "sme", "processDateTimes", "FN CATCH", {
      error: error,
    });
  }
}

const test = async (redisClient) => {
  try {
    const key = "dp:queue";
    const queueLength = await redisClient.sendCommand(["LLEN", key]);
    console.log(queueLength);
    await redisClient.quit();
  } catch (error) {
    await redisClient.quit();
    await log("error", "uuid", "sme", "redisClient", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = { processDateTimes, test };
