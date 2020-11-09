const {
  deleteTokens,
  deleteFutureFocusSession,
  deleteAllFutureFocusSessions,
} = require("../db/db");
const { getFutureFocusRef, getAllFutureFocusRefs } = require("../db/memoryDb");

module.exports = () => {
  console.log("removing calendar");
  // clear tokens in the db
  deleteTokens();
  // clear all future events in db
  deleteAllFutureFocusSessions();
  // clear all future events that have been scheduled already (in memory)
  getAllFutureFocusRefs().forEach((futureFocusRef) => {
    clearTimeout(futureFocusRef);
  });
};
