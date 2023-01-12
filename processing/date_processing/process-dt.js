const { log } = require("../../logger");
const generateDateTimeObject = require("./generate-dt-object");

async function processDateTime(jobId, sme, pgTable, hostDate, hostTime) {
  try {
    await log("info", jobId, sme, "processDateTime", "FN CALLED", null);
    let date;
    switch (pgTable) {
      case "mmb.ge_mm4":
        date = await generateDateTimeObject(
          jobId,
          sme,
          `${hostDate}${hostTime}`,
          "ddMMyyHHmm",
          "America/New_York"
        );
        break;
      case "mmb_siemens_non_tim":
        date = await generateDateTimeObject(
          jobId,
          sme,
          `${hostDate}${hostTime}`,
          'dd-MMM-yyyyHH:mm:ss',
          'America/New_York'
       );
        break;
      default:
        break;
    }
    return date;
  } catch (error) {
    await log("error", jobId, sme, "processDateTime", "FN CATCH", {
      error: error,
    });
  }
}

module.exports = processDateTime;
