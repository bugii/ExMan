const focusStart = require("./focusStart");
const {
  createNewFutureFocusSession,
  deleteFutureFocusSession,
} = require("../db/db");

module.exports = (start, end, id=null) => {
  if (!id) {
    let id = createNewFutureFocusSession(start, end)
  }
  // if id is provided, don't create the focus session again, just schedule
  else id = id

  setTimeout(() => {
    // start focus session (this also creates a new object in the currentFocusSession db key)
    focusStart(start, end);
    // Therefore, delete the entry in the futureFocusSession db key
    deleteFutureFocusSession(id);
  }, start - new Date().getTime());
};
