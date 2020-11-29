const focusStart = require("./focusStart");
const {
  createNewFutureFocusSession,
  getCurrentFocusSession,
  getSingleFutureFocusSession,
  moveFutureSessionToCurrent,
  getAllFocusSessions,
} = require("../db/db");
const {
  storeFutureFocusRef,
  getMainWindow,
  getFutureFocusRef,
} = require("../db/memoryDb");
const { ipcMain } = require("electron");

module.exports = (start, end, id, subject) => {
  // check if this focus session id had already used, e.g. check if this id is either used in the currentFocus session or in any past focus sessions
  // this avoids scheduleing a focus session from calendar again (even though it already was schedulled in a previous session)
  const currentFocusSession = getCurrentFocusSession();
  if (currentFocusSession && currentFocusSession.id === id) {
    console.log(
      "don't schedule again, same focus session has already been scheduled (currentFocusSession - db)",
      subject
    );
    return;
  }
  const pastFocusSessions = getAllFocusSessions();
  for (let index = 0; index < pastFocusSessions.length; index++) {
    const sesh = pastFocusSessions[index];
    if (sesh.id === id) {
      console.log(
        "don't schedule again, same focus session has already been scheduled (pastFocusSessions - db)",
        subject
      );
      return;
    }
  }

  // check if future focus session is in db
  // if not yet in db -> store
  if (!getSingleFutureFocusSession(id)) {
    createNewFutureFocusSession(start, end, id, subject);
  }

  // schedule a future focus session at most once
  if (!getFutureFocusRef(id)) {
    console.log("scheduling focus session", subject);

    const ref = setTimeout(() => {
      // if there is no ongoing focus session: start this one
      if (!getCurrentFocusSession()) {
        // Delete the entry in the futureFocusSession db key and move it to the currentFocusSession key in the db
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
  } else {
    console.log(
      "not scheduling future focus session again, already scheduled",
      subject
    );
  }
};
