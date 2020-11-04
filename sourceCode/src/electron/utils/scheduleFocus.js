const focusStart = require("./focusStart");
const {
  createNewFutureFocusSession,
  getCurrentFocusSession,
  getSingleFutureFocusSession,
  moveFutureSessionToCurrent,
} = require("../db/db");
const {
  storeFutureFocusRef,
  getFutureFocusRef,
  getMainWindow,
} = require("../db/memoryDb");
const { ipcMain } = require("electron");

module.exports = (start, end, id) => {
  // check if already scheduled
  if (getFutureFocusRef(id)) {
    console.log(
      "dont schedule again, same focus session has already been scheduled"
    );
    return;
  }

  // check if future focus session is in db
  // If no -> store
  if (!getSingleFutureFocusSession(id)) {
    createNewFutureFocusSession(start, end, id);
  }

  console.log("scheduling new focus session");

  const ref = setTimeout(() => {
    // if there is no ongoing focus session: start this one
    if (!getCurrentFocusSession()) {
      // Delete the entry in the futureFocusSession db key and move it to the currentFocusSession key in the db
      // deleteFutureFocusSession(id);
      moveFutureSessionToCurrent(id);

      // start focus session
      focusStart(start, end, id);

      // notify via notification that the scheduled session has started and restore window in case it was minimized for them to enter goals
      getMainWindow().send("notification-scheduled-start");
      getMainWindow().restore();
    } else {
      console.log(
        "ignoring scheduled focus session because there is an ongoing one (most likely an open one)"
      );
    }
  }, start - new Date().getTime());

  storeFutureFocusRef(id, ref);
};
