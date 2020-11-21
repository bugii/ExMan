const { refreshToken: refreshTokenGoogle } = require("../auth/googleOAuth");
const { refreshToken: refreshTokenMS } = require("../auth/outlookOAuth");
const { getTokens } = require("../db/db");
const { storeIntervallRef } = require("../db/memoryDb");
const scheduleFocus = require("../utils/scheduleFocus");
const getCalendarFocus24h = require("./getCalendarFocus24h");

const checkFocusEvents = (events) => {
  console.log("focus sessions from cal", events);
  events.forEach((event) => {
    scheduleFocus(event.start, event.end, event.id);
  });
};

const calendarLoop = async () => {
  const tokens = getTokens();

  if (tokens.google) {
    const googleCal = await getCalendarFocus24h("google");
    checkFocusEvents(googleCal);
  } else if (tokens.microsoft) {
    const msCal = await getCalendarFocus24h("microsoft");
    checkFocusEvents(msCal);
  }
};

module.exports = async () => {
  console.log("calendar loop start");
  // First, get a fresh token for google/microsoft
  // those functions also work if the calendars are not set up
  await refreshTokenGoogle();
  await refreshTokenMS();

  calendarLoop();

  const ref = setInterval(async () => {
    calendarLoop();
  }, 60000);

  storeIntervallRef(ref);
};
