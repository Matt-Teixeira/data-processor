('use strict');
require('dotenv').config();
const { log } = require('./logger');

const onBoot = async () => {
   log('info', 'NA', 'NA', 'onBoot', `FN CALL`, {
      LOGGER: process.env.LOGGER,
      REDIS_IP: process.env.REDIS_IP,
      PG_USER: process.env.PG_USER,
      PG_DB: process.env.PG_DB,
   });

   // SETUP ENV BASED RESOURCES -> REDIS CLIENT, JOB SCHEDULES
   // const clienConfig = {
   //    socket: {
   //       port: 6379,
   //       host: process.env.REDIS_IP,
   //    },
   // };
   // const redisClient = redis.createClient(clienConfig);

   // redisClient.on(
   //    'error',
   //    async (err) =>
   //       await log('error', 'NA', 'NA', 'redisClient', `ON ERROR`, {
   //          // TODO: KILL APP?
   //          error: err,
   //       })
   // );
   // await redisClient.connect();
};
onBoot();
