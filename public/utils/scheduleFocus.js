const focusStart = require("./focusStart");
const {
  createNewFutureFocusSession,
  deleteFutureFocusSession,
} = require("../db/db");

module.exports = (start, end) => {
  const id = createNewFutureFocusSession(start, end);

  setTimeout(() => {
    // start focus session (this also creates a new object in the currentFocusSession db key)
    focusStart(start, end);
    // Therefore, delete the entry in the futureFocusSession db key
    deleteFutureFocusSession(id);
  }, start - new Date().getTime());
};
