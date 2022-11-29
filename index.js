('use strict');
require('dotenv').config();
const { log } = require('./logger');
const redis = require('redis');
const { getSystemIpAddress } = require('./sql/qf-provider');

const onBoot = async () => {
   log('info', 'NA', 'NA', 'onBoot', `FN CALL`, {
      LOGGER: process.env.LOGGER,
      REDIS_IP: process.env.REDIS_IP,
      PG_USER: process.env.PG_USER,
      PG_DB: process.env.PG_DB,
   });

   // SETUP ENV BASED RESOURCES -> REDIS CLIENT, JOB SCHEDULES
   const clienConfig = {
      socket: {
         port: 6379,
         host: process.env.REDIS_IP,
      },
   };
   const redisClient = redis.createClient(clienConfig);

   redisClient.on(
      'error',
      async (error) =>
         await log('error', 'NA', 'NA', 'redisClient', `ON ERROR`, {
            // TODO: KILL APP?
            error: error,
         })
   );
   await redisClient.connect();

   // REDIS I/O EXAMPLE
   try {
      // WRITE
      const key = 'SME123_temp';
      const value = '32F';
      await redisClient.set(key, value);
      // READ
      const reading = await redisClient.get(key);
      await log('info', 'uuid', 'sme', 'redisClient', 'FN DETAILS', {
         reading: reading,
      });
   } catch (error) {
      await log('error', 'uuid', 'sme', 'redisClient', 'FN CATCH', {
         error: error,
      });
   }

   // PG I/O EXAMPLE VIA QUERY FILE
   try {
      // GET IP_ADDRESS OF SOME SYSTEM
      const sme = ['SME13571'];
      const ipAddress = await getSystemIpAddress('uuid', sme);
      await log('info', 'uuid', 'sme', 'pgPromise', 'FN DETAILS', {
         ipAddress: ipAddress,
      });
   } catch (error) {
      await log('error', 'uuid', 'sme', 'pgPromise', 'FN CATCH', {
         error: error,
      });
   }
};
onBoot();
