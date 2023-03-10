("use strict");
require("dotenv").config();
const { log } = require("./logger");
const redis = require("redis");
const {
  getSystemIpAddress,
  getSystemData,
  getPgTable,
  updateDateTime,
} = require("./sql/qf-provider");
const processDateTime = require("./processing/date_processing/process-dt");

const onBoot = async () => {
  log("info", "NA", "NA", "onBoot", `FN CALL`, {
    LOGGER: process.env.LOGGER,
    REDIS_IP: process.env.REDIS_IP,
    PG_USER: process.env.PG_USER,
    PG_DB: process.env.PG_DB,
  });

  table_keys = {
    mmb_siemens_non_tim: 'mmb.siemens_non_tim',
    mmb_siemens: 'mmb.siemens',
    mmb_ge_mm3: 'mmb.ge_mm3',
    mmb_ge_mm4: 'mmb.ge_mm4'
  }

  // SETUP ENV BASED RESOURCES -> REDIS CLIENT, JOB SCHEDULES
  const clienConfig = {
    socket: {
      port: 6379,
      host: process.env.REDIS_IP,
    },
  };
  const redisClient = redis.createClient(clienConfig);

  redisClient.on(
    "error",
    async (error) =>
      await log("error", "NA", "NA", "redisClient", `ON ERROR`, {
        // TODO: KILL APP?
        error: error,
      })
  );
  await redisClient.connect();

  // REDIS I/O EXAMPLE
  try {
    const key = "dp:queue";
    const queueLength = await redisClient.sendCommand(["LLEN", key]);
    console.log(queueLength);

    for (let i = 0; i < queueLength; i++) {
      const reading = await redisClient.sendCommand(["RPOP", key]);

      await log("info", "uuid", "sme", "redisClient", "FN DETAILS", {
        reading: reading,
      });

      /**** PROCESS DATA ****/

      const queueData = await JSON.parse(reading);
      console.log(queueData);

      const dtObject = await processDateTime(
        "123",
        queueData.system_id,
        queueData.pg_table,
        queueData.host_date,
        queueData.host_time
      );

      let returnedData = await updateDateTime("456", [
        table_keys[queueData.pg_table],
        dtObject,
        queueData.system_id,
        queueData.host_date,
        queueData.host_time,
      ]);

      console.log(returnedData);
      if (!returnedData) {
        // If data processing fails, push to head of list
        await redisClient.sendCommand(["RPUSH", key, reading]);
      }
    }
    /**** PROCESS DATA ****/

    await redisClient.quit();
  } catch (error) {
    await redisClient.quit();
    console.log(error);
    await log("error", "uuid", "sme", "redisClient", "FN CATCH", {
      error: error,
    });
  }

  // PG I/O EXAMPLE VIA QUERY FILE
  /*  try {
    // GET IP_ADDRESS OF SOME SYSTEM
    const sme = ["SME01121"];
    const systemData = await getPgTable("uuid", sme);
    await log("info", "uuid", "sme", "pgPromise", "FN DETAILS", {
      systemData: systemData,
    });
    console.log(systemData);
  } catch (error) {
    console.log(error);
    await log("error", "uuid", "sme", "pgPromise", "FN CATCH", {
      error: error,
    });
  } */
};
onBoot();

/* 
SME01096
SME09782
SME12501
SME01097
SME13573
SME12753
SME01115
SME13576
SME01101
SME01111
SME12029
SME01100
SME01122
SME01096
SME12083 */
