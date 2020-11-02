const focusStart = require("./focusStart");
const {
  createNewFutureFocusSession,
  deleteFutureFocusSession,
  getCurrentFocusSession,
  getSingleFutureFocusSession,
} = require("../db/db");
const { storeFutureFocusRef, getFutureFocusRef } = require("../db/memoryDb");

module.exports = (start, end, id) => {
  // check if future focus session is in db
  // If no -> store
  if (!getSingleFutureFocusSession()) {
    createNewFutureFocusSession(start, end, id);
  }

  // check if already scheduled
  if (getFutureFocusRef(id)) {
    console.log(
      "dont schedule again, same focus session has already been scheduled"
    );
    return;
  }

  console.log("scheduling new focus session");

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
