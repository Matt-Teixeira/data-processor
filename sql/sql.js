const { QueryFile } = require('pg-promise');
const { join: joinPath } = require('path');

// HELPER FOR LINKING TO EXTERNAL QUERY FILES
const sql = (file) => {
   const fullPath = joinPath(__dirname, file); // generating full path;
   return new QueryFile(fullPath, { minify: true });
};

module.exports = {
   system: {
      ipAddress: sql('system/ip-address.sql'),
   },
};
