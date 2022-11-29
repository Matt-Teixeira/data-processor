const db = require('../db/pgPool');
const { log } = require('../logger');
const { system } = require('./sql');

// GENERIC LOGGER FOR ANY QF CALL
const logQf = async (uuid, fn, qfArgs) => {
   await log('info', uuid, 'sme', fn, `FN CALL`, {
      qfArgs: qfArgs,
   });
};

const getSystemIpAddress = async (uuid, sme) => {
   await logQf(uuid, 'getSystemIpAddress', sme);
   return db.any(system.ipAddress, sme);
};

module.exports = { getSystemIpAddress };
