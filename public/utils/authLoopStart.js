const { getDb } = require("../db/db");

const { getAuthStatus: getAuthStatusGmail } = require("../services/gmail");
const { getAuthStatus: getAuthStatusOutlook } = require("../services/outlook");
const { getAuthStatus: getAuthStatusSkype } = require("../services/skype");
const { getAuthStatus: getAuthStatusSlack } = require("../services/slack");
const { getAuthStatus: getAuthStatusTeams } = require("../services/teams");
const {
  getAuthStatus: getAuthStatusWhatsapp,
} = require("../services/whatsapp");

async function authLoopStart(webContentsId) {
  console.log("auth loop start", webContentsId);
  const service = getDb().get("services").find({ webContentsId }).value();

  let intervallRef;

  intervallRef = setInterval(async () => {
    switch (service.name) {
      case "slack":
        const statusSlack = await getAuthStatusSlack(webContentsId);
        if (statusSlack) {
          getDb()
            .get("services")
            .find({ webContentsId })
            .assign({ authed: true })
            .write();
          clearInterval(intervallRef);
          console.log("auth loop end", webContentsId);
        }

        break;

      case "teams":
        const statusTeams = await getAuthStatusTeams(webContentsId);
        if (statusTeams) {
          getDb()
            .get("services")
            .find({ webContentsId })
            .assign({ authed: true })
            .write();
          clearInterval(intervallRef);
          console.log("auth loop end", webContentsId);
        }

        break;

      case "skype":
        const statusSkype = await getAuthStatusSkype(webContentsId);
        if (statusSkype) {
          getDb()
            .get("services")
            .find({ webContentsId })
            .assign({ authed: true })
            .write();
          clearInterval(intervallRef);
          console.log("auth loop end", webContentsId);
        }
        break;

      case "whatsapp":
        const statusWhatsapp = await getAuthStatusWhatsapp(webContentsId);
        if (statusWhatsapp) {
          getDb()
            .get("services")
            .find({ webContentsId })
            .assign({ authed: true })
            .write();
          clearInterval(intervallRef);
          console.log("auth loop end", webContentsId);
        }
        break;

      case "gmail":
        const statusGmail = await getAuthStatusGmail(webContentsId);
        if (statusGmail) {
          getDb()
            .get("services")
            .find({ webContentsId })
            .assign({ authed: true })
            .write();
          clearInterval(intervallRef);
          console.log("auth loop end", webContentsId);
        }

        break;

      case "outlook":
        const statusOutlook = await getAuthStatusOutlook(webContentsId);
        if (statusOutlook) {
          getDb()
            .get("services")
            .find({ webContentsId })
            .assign({ authed: true })
            .write();
          clearInterval(intervallRef);
          console.log("auth loop end", webContentsId);
        }
        break;

      default:
        break;
    }
  }, 3000);
}

module.exports = authLoopStart;
