const { endCurrentFocusSession, setEndTime } = require("../db/db");
const { getMainWindow, setFocus, getFocusEndRef } = require("../db/memoryDb");

const serviceManager = require("../services/ServicesManger");
const bringToFront = require("./bringToFront");

function focusEnd() {
  console.log("focus end");
  // manually set the endTime of the focus session to the current time. This results in endTime != originalEndTime -> we can see which sessions were aborted manually
  setEndTime(new Date().getTime());

  //get ongoing focus sessions
  const services = serviceManager.getServicesComplete();

  services.forEach((service) => {
    // End the focus of each service by calling each service's focusEnd() function
    service.focusEnd();
  });

  // End all 'global' (not the one of each service) timeouts (in case of an early termination of the focus session)
  clearTimeout(getFocusEndRef());

  // remove current focus session from db
  endCurrentFocusSession();
  // tell react that focus has ended, so it can update the state
  getMainWindow().webContents.send("focus-end-successful");

  setFocus(false);

  bringToFront();
}

module.exports = focusEnd;
