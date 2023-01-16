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
