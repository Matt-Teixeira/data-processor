const { log } = require("../../logger");
const dateTimeTemplate = require("./dateTimeTemplate");

async function generateDateTime(jobId, sme, pgTable, hostDate, hostTime) {
  try {
    await log("info", jobId, sme, "generateDateTime", "FN CALLED", null);
    let date;
    switch (pgTable) {
      case "mmb.ge_mm4":
        date = await dateTimeTemplate(
          jobId,
          sme,
          `${hostDate}${hostTime}`,
          "ddMMyyHHmm",
          "America/New_York"
        );
        break;
      case "mmb.siemens_non_tim":
        date = await dateTimeTemplate(
          jobId,
          sme,
          `${hostDate}${hostTime}`,
          "dd-MMM-yyyyHH:mm:ss",
          "America/New_York"
        );
        break;
      case "mmb.siemens":
        date = await dateTimeTemplate(
          jobId,
          sme,
          `${hostDate}${hostTime}`,
          "dd-MMM-yyHH:mm:ss",
          "America/New_York"
        );
        break;
        case "mmb.ge_mm3":
        date = await dateTimeTemplate(
          jobId,
          sme,
          `${hostDate}${hostTime}`,
          "dd-MMM-yyHH:mm",
          "America/New_York"
        );
        break;
      default:
        break;
    }
    return date;
  } catch (error) {
    await log("error", jobId, sme, "generateDateTime", "FN CATCH", {
      error: error,
    });
  }
}

module.exports = generateDateTime;
