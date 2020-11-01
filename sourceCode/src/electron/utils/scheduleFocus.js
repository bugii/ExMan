const focusStart = require("./focusStart");
const {
  createNewFutureFocusSession,
  deleteFutureFocusSession,
  getCurrentFocusSession,
  getAllFutureFocusSessions,
} = require("../db/db");
const { storeFutureFocusRef } = require("../db/memoryDb");

module.exports = (start, end, id) => {
  const futureSessions = getAllFutureFocusSessions();
  // If we try to schedule a future focus session with the same id again
  // -> don't allow
  for (const session of futureSessions) {
    if (id === session.id) {
      return;
    }
  }

  console.log("scheduling new focus session");
  createNewFutureFocusSession(start, end, id);

  const ref = setTimeout(() => {
    // if there is no ongoing focus session: start this one
    if (!getCurrentFocusSession()) {
      // start focus session (this also creates a new object in the currentFocusSession db key)
      focusStart(start, end);
      // Therefore, delete the entry in the futureFocusSession db key
      deleteFutureFocusSession(id);
    } else {
      console.log(
        "ignoring scheduled focus session because there is an ongoing one (most likely an open one)"
      );
    }
  }, start - new Date().getTime());

  storeFutureFocusRef(id, ref);
};
