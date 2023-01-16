("use strict");
require("dotenv").config();
const { log } = require("./logger");
const initRedis = require("./redis");
const {
  processDateTimes,
  test,
} = require("./processing/date_processing/processDateTimes");

const onBoot = async () => {
  log("info", "NA", "NA", "onBoot", `FN CALL`, {
    LOGGER: process.env.LOGGER,
    REDIS_IP: process.env.REDIS_IP,
    PG_USER: process.env.PG_USER,
    PG_DB: process.env.PG_DB,
  });

  try {
    const redisClient = await initRedis(6379, process.env.REDIS_IP);

    console.time();
    await processDateTimes(redisClient);
    console.timeEnd();

  } catch (error) {
    await redisClient.quite();
    await log("error", "NA", "NA", "redisClient", `ON ERROR`, {
      error: error,
    });
  }
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
