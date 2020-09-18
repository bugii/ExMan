const { getDb, getCurrentFocusSession, allServicesReadyAndAuthed, getAllFutureFocusSessions, deleteFutureFocusSession } = require("../db/db");

const { getAuthStatus: getAuthStatusGmail } = require("../services/gmail");
const { getAuthStatus: getAuthStatusOutlook } = require("../services/outlook");
const { getAuthStatus: getAuthStatusSkype } = require("../services/skype");
const { getAuthStatus: getAuthStatusSlack } = require("../services/slack");
const { getAuthStatus: getAuthStatusTeams } = require("../services/teams");
const {
  getAuthStatus: getAuthStatusWhatsapp,
} = require("../services/whatsapp");
const focusStart = require("./focusStart");
const scheduleFocus = require("./scheduleFocus");
const focusEnd = require("./focusEnd");

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

    // Check whether all services are ready & authed
    if (allServicesReadyAndAuthed()) {
      console.log('all services are ready')
      // check if there is a currentFocus Session, if so -> start automatically
      const currentFocusSession = getCurrentFocusSession()
      const futureFocusSessions = getAllFutureFocusSessions()
      if (currentFocusSession) {
        // still going?
        if (currentFocusSession.endTime > new Date().getTime()) {
            console.log('current focus session found, starting..')
            focusStart(currentFocusSession.startTime, currentFocusSession.endTime, currentFocusSession.id)
        }
        else {
          // end the currentFocusSession
          console.log('current focus session already ended, ending..')
          focusEnd()
        }
      }
      // check if there are future focus Sessions -> register them again
        futureFocusSessions.forEach(focusSession => {
          
          if (focusSession.endTime > new Date().getTime()) {
            // end in the future
            console.log('future session found, registering..')
            scheduleFocus(focusSession.startTime, focusSession.endTime, focusSession.id)
          }
          else {
            console.log('future session is completely in the past, deleting..')
            deleteFutureFocusSession(focusSession.id)
          }
        })
      }
  }, 3000);
}

module.exports = authLoopStart;
