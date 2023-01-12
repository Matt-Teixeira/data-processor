const { log } = require("../../logger");
const { DateTime } = require("luxon");

const generateDateTimeObject = async (
  jobId,
  sme,
  dtString,
  inputPattern,
  ianaTz
) => {
  await log("info", jobId, sme, "generateDateTimeObject", "FN CALLED", {
    dtString: dtString,
    inputPattern: inputPattern,
    ianaTz: ianaTz,
  });

  return DateTime.fromFormat(dtString, inputPattern, {
    zone: ianaTz,
  }).toISO();
};

module.exports = generateDateTimeObject;
