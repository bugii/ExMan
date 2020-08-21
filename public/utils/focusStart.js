const {
  getDb,
  createFocusSession,
  getCurrentFocusSession,
} = require("../db/db");

const {
  setDnd: setDndSlack,
  getMessages: getMessagesSlack,
} = require("../services/slack");

const {
  setDnd: setDndTeams,
  getMessages: getMessagesTeams,
} = require("../services/teams");

function focusStart(startTime, endTime) {
  console.log("focus start from", startTime, "to", endTime);
  // 1. Create a focus object in DB to reference and update with data later on
  createFocusSession(startTime, endTime);

  let currentFocusSessionIntervalSlack;
  let currentFocusSessionIntervalTeams;

  // 2. Set status of apps to DND if possible
  // Get all registered services
  const currentFocusSession = getCurrentFocusSession();
  currentFocusSession.services.forEach((service) => {
    switch (service.name) {
      case "slack":
        setDndSlack(service.webContentsId, diffMins);
        currentFocusSessionIntervalSlack = setInterval(function () {
          var startTime = new Date().getTime() / 1000 - 20;
          getMessagesSlack(
            service.webContentsId,
            startTime,
            "Hello from ExMan"
          );
        }, 20000);
        break;

      case "teams":
        setDndTeams(service.webContentsId);
        var startTime = new Date().getTime() / 1000 - 60;
        currentFocusSessionIntervalTeams = setInterval(function () {
          const currentTeamsSession = getDb()
            .get("currentFocusSession")
            .get("services")
            .find({ webContentsId: service.webContentsId })
            .value();

          getMessagesTeams(
            service.webContentsId,
            startTime,
            currentTeamsSession ? currentTeamsSession["syncToken"] : null
          );
        }, 20000);
        break;

      case "skype":
        break;

      case "whatsapp":
        break;

      default:
        break;
    }
  });

  return [currentFocusSessionIntervalSlack, currentFocusSessionIntervalTeams];
}

module.exports = focusStart;
