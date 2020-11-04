const { getPreviousFocusSession, getLastAppStartTime } = require("../db/db");
const {
  getFocus,
  getMainWindow,
  storeIntervallRef,
} = require("../db/memoryDb");

let lastTimeAsked = null;

module.exports = () => {
  reminderLoop();

  const ref = setInterval(() => {
    reminderLoop();
  }, 60000);

  storeIntervallRef(ref);
};

const reminderLoop = () => {
  // If currently not in focus -> check how long ago last focus session was
  if (!getFocus()) {
    const prevSession = getPreviousFocusSession();
    const endTime = prevSession.endTime;
    const currentTime = new Date().getTime();

    // If last focus session was more than 3h ago
    // And if app has been opened for at least 1h, otherwise user could get reminder right upon app start
    if (
      endTime + 180 * 60000 < currentTime &&
      getLastAppStartTime() + 60 * 60000 < currentTime
    ) {
      // and we have either not asked yet or not asked in the last 2h
      if (!lastTimeAsked || lastTimeAsked + 120 * 60000 < currentTime) {
        getMainWindow().send("notification-focus-reminder");
        console.log("reminding to start a focus session");
        lastTimeAsked = currentTime;
      }
    }
  }
};
