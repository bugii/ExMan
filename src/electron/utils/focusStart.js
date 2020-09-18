const { webContents } = require("electron");

const {
  getDb,
  createNewFocusSession,
  getCurrentFocusSession,
  getAutoresponse,
  getServices,
} = require("../db/db");

const focusEnd = require("./focusEnd");

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

function focusStart(startTime, endTime, id = null) {
  console.log("focus start from", startTime, "to", endTime);
  // 1. Create a focus object in DB to reference and update with data later on
  // Only create new focus session if id is not provided: avoids overwriting of focus sessions if a focus
  // session after the app was closed and reopened again (with a still ongoing focus session)
  if (!id) {
    createNewFocusSession(startTime, endTime);
  }

  const diffMins = (endTime - startTime) / 1000 / 60;
  console.log("diff mins", diffMins);

  let currentFocusSessionIntervalSlack;
  let currentFocusSessionIntervalTeams;

  const message = getAutoresponse();

  // 2. Set status of apps to DND if possible and start auto message loop
  const services = getServices();

  services.forEach((service) => {
    // mute audio on focus-start
    webContents.fromId(service.webContentsId).setAudioMuted(true);

    switch (service.name) {
      case "slack":
        setDndSlack(service.webContentsId, diffMins);
        currentFocusSessionIntervalSlack = setInterval(function () {
          var startTime = new Date().getTime() / 1000 - 10;
          getMessagesSlack(service.webContentsId, startTime, message);
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
          message
        );

        currentFocusSessionIntervalTeams = setInterval(function () {
          const currentTeamsSession = getDb()
            .get("currentFocusSession")
            .get("services")
            .find({ webContentsId: service.webContentsId })
            .value();

          getMessagesTeams(
            service.webContentsId,
            startTime,
            currentTeamsSession ? currentTeamsSession["syncToken"] : null,
            message
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
