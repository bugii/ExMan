const { webContents } = require("electron");
const {
  getCurrentFocusSession,
  endCurrentFocusSession,
  getServices,
} = require("../db/db");
const {
  getIntervallRefs,
  getTimeoutRefs,
  getMainWindow,
} = require("../db/memoryDb");
const { setOnline: setOnlineSlack } = require("../services/slack");
const { setOnline: setOnlineTeams } = require("../services/teams");

function focusEnd() {
  console.log("focus end");
  //get ongoing focus sessions
  const services = getServices();

  services.forEach((service) => {
    // unmute audio on focus-end
    console.log(service.webContentsId);
    webContents.fromId(service.webContentsId).setAudioMuted(false);

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
  getIntervallRefs().forEach((intervallRef) => clearInterval(intervallRef));
  // End all timeouts (in case of an early termination of the focus session)
  getTimeoutRefs().forEach((timeoutRef) => clearTimeout(timeoutRef));

  // remove current focus session from db
  endCurrentFocusSession();
  // tell react that focus has ended, so it can update the state
  getMainWindow().webContents.send("focus-end-successful");
}

module.exports = focusEnd;
