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

      await log("info", "uuid", "sme", "processDateTimes", "FN DETAILS", {
        reading: reading,
      });

      await redisClient.sendCommand(["LPUSH", key, reading]);

      /**** PROCESS DATE ****/

      const queueData = await JSON.parse(reading);

      const dtObject = await generateDateTime(
        "uuid",
        queueData.system_id,
        table_keys[queueData.pg_table],
        queueData.host_date,
        queueData.host_time
      );

      const updatedDb = await updateDateTime("TEST", [
        table_keys[queueData.pg_table],
        dtObject,
        queueData.system_id,
        queueData.host_date,
        queueData.host_time,
      ]);

      // console.log(updatedDb);

      if (!updatedDb) {
        console.log("NOTHING RETURNED");
        // If data processing fails, push to head of list
        await redisClient.sendCommand(["LPUSH", key, reading]);
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
