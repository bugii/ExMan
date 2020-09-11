const { webContents } = require("electron");

const {
  getDb,
  createNewFocusSession,
  getCurrentFocusSession,
} = require("../db/db");

const {
  storeIntervallRef,
  storeTimeoutRef,
  getMainWindow,
} = require("../db/memoryDb");

const {
  setDnd: setDndSlack,
  getMessages: getMessagesSlack,
} = require("../services/slack");

const {
  setDnd: setDndTeams,
  getMessages: getMessagesTeams,
  syncTokenLoop: teamsLoop,
} = require("../services/teams");

function focusStart(startTime, endTime) {
  console.log("focus start from", startTime, "to", endTime);
  // 1. Create a focus object in DB to reference and update with data later on
  createNewFocusSession(startTime, endTime);

  const diffMins = (endTime - startTime) / 1000 / 60;
  console.log("diff mins", diffMins);

  // 2. Set status of apps to DND if possible and start auto message loop
  const currentFocusSession = getCurrentFocusSession();

  currentFocusSession.services.forEach((service) => {
    // mute audio on focus-start
    webContents.fromId(service.webContentsId).setAudioMuted(true);

    switch (service.name) {
      case "slack":
        setDndSlack(service.webContentsId, diffMins);
        const currentFocusSessionIntervalSlack = setInterval(function () {
          var startTime = new Date().getTime() / 1000 - 10;
          getMessagesSlack(
            service.webContentsId,
            startTime,
            "Hello from ExMan"
          );
        }, 10001);
        storeIntervallRef(currentFocusSessionIntervalSlack);

        break;

      case "teams":
        setDndTeams(service.webContentsId);
        var startTime = new Date().getTime() / 1000 - 60;

        const currentTeamsSessionInitial = getDb()
          .get("currentFocusSession")
          .get("services")
          .find({ webContentsId: service.webContentsId })
          .value();

        getMessagesTeams(
          service.webContentsId,
          startTime,
          currentTeamsSessionInitial
            ? currentTeamsSessionInitial["syncToken"]
            : null,
          "Hello from electron"
        );

        const currentFocusSessionIntervalTeams = setInterval(function () {
          const currentTeamsSession = getDb()
            .get("currentFocusSession")
            .get("services")
            .find({ webContentsId: service.webContentsId })
            .value();

          getMessagesTeams(
            service.webContentsId,
            startTime,
            currentTeamsSession ? currentTeamsSession["syncToken"] : null,
            "Hello from electron"
          );
        }, 20000);
        storeIntervallRef(currentFocusSessionIntervalTeams);

        break;

      default:
        break;
    }
  });

  // if focus start successful, update the react app
  getMainWindow().webContents.send("focus-start-successful", {
    startTime,
    endTime,
  });

  // schedule automatic focus end
  const focusEndTimeoutRef = setTimeout(() => {
    focusEnd();
  }, endTime - new Date().getTime());
  storeTimeoutRef(focusEndTimeoutRef);
}

module.exports = focusStart;
