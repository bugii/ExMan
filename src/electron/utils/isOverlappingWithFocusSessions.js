const {
  getCurrentFocusSession,
  getAllFutureFocusSessions,
} = require("../db/db");

module.exports = (startA, endA) => {
  // Get start & end time of current focus session (if exists)
  const currentFocusSession = getCurrentFocusSession();
  if (currentFocusSession) {
    startB = currentFocusSession.startTime;
    endB = currentFocusSession.endTime;

    if (isOverlapping(startA, endA, startB, endB)) {
      console.log("overlapping with current focus session");
      return true;
    }
  }

  // Get start & end of all future focus sessions (if exist)
  const futureFocusSessions = getAllFutureFocusSessions();

  for (let index = 0; index < futureFocusSessions.length; index++) {
    const futureFocusSession = futureFocusSessions[index];

    startB = futureFocusSession.startTime;
    endB = futureFocusSession.endTime;

    if (isOverlapping(startA, endA, startB, endB)) {
      console.log("overlapping with future focus session");
      return true;
    }
  }

  // No overlap
  return false;
};

function isOverlapping(startA, endA, startB, endB) {
  if (startA <= endB && endA >= startB) {
    return true;
  } else return false;
}
