const { createNewFocusSession } = require("../db/db");
const focusEnd = require("./focusEnd");
const { getMainWindow, setFocus, storeFocusEndRef } = require("../db/memoryDb");
const serviceManager = require("../services/ServicesManger");

function focusStart(startTime, endTime = null, id = null) {
  // not all services authed -> can't start focus session
  if (!serviceManager.allAuthed) {
    getMainWindow().webContents.send("error", "/not-authed");
    console.log("error starting focus session - not all services authed");
    return;
  }

  console.log("focus start from", startTime, "to", endTime);
  // 1. Create a focus object in DB to reference and update with data later on
  // Only create new focus session if id is not provided: avoids overwriting of focus sessions if
  // the app was closed and reopened again (with a still ongoing focus session)
  if (!id) {
    createNewFocusSession(startTime, endTime, false);
  }

  const services = serviceManager.getServicesComplete();
  services.forEach((service) => {
    // Call each individual focusStart method for each service
    service.focusStart();
  });

  // if focus start successful, update the react app
  getMainWindow().webContents.send("focus-start-successful", {
    startTime,
    endTime,
  });

  setFocus(true);

  // schedule automatic focus end if endTime is specified
  if (endTime) {
    const focusEndTimeoutRef = setTimeout(() => {
      focusEnd();
    }, endTime - new Date().getTime());

    storeFocusEndRef(focusEndTimeoutRef);
  }
}

module.exports = focusStart;
