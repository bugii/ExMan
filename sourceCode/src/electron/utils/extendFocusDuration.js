const { getFocusEndRef, storeFocusEndRef } = require("../db/memoryDb");
const { getCurrentFocusSession, setEndTime } = require("../db/db");
const focusEnd = require("./focusEnd");
const updateFrontend = require("./updateFrontend");

module.exports = (minutes) => {
  // Get timeout ref for focus end, and delete
  clearTimeout(getFocusEndRef());

  // Get focusEnd time from db and add the selected amount of minutes
  const focusEndTime = getCurrentFocusSession().endTime;
  const newFocusEndTime = focusEndTime + minutes * 60 * 1000;

  // Adjust value in db
  setEndTime(newFocusEndTime);

  // Set timeout again
  const newFocusEndRef = setTimeout(() => {
    focusEnd();
  }, newFocusEndTime - new Date().getTime());

  storeFocusEndRef(newFocusEndRef);
  updateFrontend();
};
