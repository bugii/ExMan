const { webContents } = require("electron");
const { endCurrentFocusSession } = require("../db/db");
const {
  getIntervallRefs,
  getTimeoutRefs,
  getMainWindow,
} = require("../db/memoryDb");

const serviceManager = require("../services/ServicesManger");

function focusEnd() {
  console.log("focus end");
  //get ongoing focus sessions
  const services = serviceManager.getServicesComplete();

  services.forEach((service) => {
    // End the focus of each service by calling each service's focusEnd() function
    service.focusEnd();
  });

  // End all 'global' (not the one of each service) timeouts (in case of an early termination of the focus session)
  getTimeoutRefs().forEach((timeoutRef) => clearTimeout(timeoutRef));

  // remove current focus session from db
  endCurrentFocusSession();
  // tell react that focus has ended, so it can update the state
  getMainWindow().webContents.send("focus-end-successful");
}

module.exports = focusEnd;
