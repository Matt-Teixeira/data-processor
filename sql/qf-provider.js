const db = require('../db/pgPool');
const { log } = require('../logger');
const { system } = require('./sql');

// GENERIC LOGGER FOR ANY QF CALL
const logQf = async (uuid, fn, qfArgs) => {
   await log('info', uuid, fn, `FN CALL`, {
      qfArgs: qfArgs,
   });
};

const getSystemIpAddress = async (uuid, systemId) => {
   await logQf(uuid, 'getSystemIpAddress', systemId);
   return db.any(system.ipAddress, systemId);
};

module.exports = { getSystemIpAddress };