const { getCurrentFocusSession, endCurrentFocusSession } = require("../db/db");
const { setOnline: setOnlineSlack } = require("../services/slack");
const { setOnline: setOnlineTeams } = require("../services/teams");

function focusEnd(intervallRefs) {
  console.log("focus end");
  //get ongoing focus sessions
  const currentFocusSession = getCurrentFocusSession();
  // TODO: set status to active again for all services -> use 'setOnline' function
  currentFocusSession.services.forEach((service) => {
    switch (service.name) {
      case "slack":
        // stop dnd mode on slack
        setOnlineSlack(service.webContentsId);
        break;

      case "teams":
        // stop dnd mode on teams
        setOnlineTeams(service.webContentsId);
        break;

      case "skype":
        break;

      case "whatsapp":
        break;

      default:
        break;
    }
  });

  // End all the intervalls
  intervallRefs.forEach((intervallRef) => {
    clearInterval(intervallRef);
  });
  // remove current focus session from db
  endCurrentFocusSession();
}

module.exports = focusEnd;
