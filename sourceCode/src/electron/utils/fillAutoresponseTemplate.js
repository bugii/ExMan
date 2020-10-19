const { getSettings, getCurrentFocusSession } = require("../db/db");

module.exports = () => {
  // get autoresponse string from database
  let autoReply = getSettings().autoReply;

  // get time left in focus session from database
  const currentFocusSession = getCurrentFocusSession();
  let timeLeft = "unknown";
  if (currentFocusSession.originalEndTime) {
    timeLeft = Math.ceil(
      (currentFocusSession.originalEndTime - new Date().getTime()) / 1000 / 60
    );
  }

  // replace ${time} string with number of minutes
  autoReply = autoReply.replace("${time}", `${timeLeft} minutes`);

  return autoReply;
};
