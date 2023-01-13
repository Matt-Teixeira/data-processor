const db = require("../db/pgPool");
const { log } = require("../logger");
const { system_ip, system_data, pg_table, update_date_time } = require("./sql");

// GENERIC LOGGER FOR ANY QF CALL
const logQf = async (uuid, fn, qfArgs) => {
  await log("info", uuid, "sme", fn, `FN CALL`, {
    qfArgs: qfArgs,
  });
};

const getSystemIpAddress = async (uuid, sme) => {
  await logQf(uuid, "getSystemIpAddress", sme);
  return db.any(system_ip.ipAddress, sme);
};

const getSystemData = async (uuid, sme) => {
  await logQf(uuid, "getSystemData", sme);
  return db.one(system_data.smeNumber, sme);
};

const getPgTable = async (uuid, sme) => {
  await logQf(uuid, "getPgTable", sme);
  return db.one(pg_table.smeNumber, sme);
};

const updateDateTime = async (uuid, argsArray) => {
  try {
    await logQf(uuid, "updateDateTime", argsArray[2], {
      args: argsArray
    });
    return db.any(update_date_time.dateTime, argsArray);
  } catch (error) {
    await log("error", uuid, argsArray[2], 'updateDateTime', `FN CALL`);
  }
}



module.exports = { getSystemIpAddress, getSystemData, getPgTable, updateDateTime };
