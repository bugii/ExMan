const { createNewFocusSession } = require("../db/db");
const focusEnd = require("./focusEnd");
const { storeTimeoutRef, getMainWindow, setFocus } = require("../db/memoryDb");

const serviceManager = require("../services/ServicesManger");

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

  const services = serviceManager.getServicesComplete();
  services.forEach((service) => {
    // Call each individual focusStart method for each service
    service.focusStart(diffMins);
  });

  // if focus start successful, update the react app
  getMainWindow().webContents.send("focus-start-successful", {
    startTime,
    endTime,
  });

  setFocus(true);

  // schedule automatic focus end
  const focusEndTimeoutRef = setTimeout(() => {
    focusEnd();
  }, endTime - new Date().getTime());

  storeTimeoutRef(focusEndTimeoutRef);
}

module.exports = focusStart;
