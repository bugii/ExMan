const { ipcMain } = require("electron");
const {
  setEndTime,
  getPreviousFocusSession,
  getAllFocusSessions,
  getAllFutureFocusSessions,
  deleteFutureFocusSession,
  storeBreakFocusClicks,
  getSettings,
  storeDefaultFocusSession,
} = require("../db/db");
const { getFocus, getFutureFocusRef } = require("../db/memoryDb");
const extendFocusDuration = require("../utils/extendFocusDuration");
const focusEnd = require("../utils/focusEnd");
const focusStart = require("../utils/focusStart");
const isOverlappingWithFocusSessions = require("../utils/isOverlappingWithFocusSessions");
const isWrongFocusDuration = require("../utils/isWrongFocusDuration");
const scheduleFocus = require("../utils/scheduleFocus");
const deleteCalendarEvent = require("../calendar/deleteCalendarEvent");

ipcMain.on("focus-start-request", (e, { startTime, endTime }) => {
  console.log("focus requested from react", startTime, endTime);
  // if already in focus mode -> can't start again
  if (getFocus()) {
    e.reply("error", "/already-focused");
    console.log("error starting focus session - already in focus");
    return;
  }
  // if there is an overlap with a future focus session -> can't start
  if (isOverlappingWithFocusSessions(startTime, endTime)) {
    e.reply("error", "/focus-overlap");
    console.log(
      "error starting focus session - overlap with current or future focus session"
    );
    return;
  }
  if (isWrongFocusDuration(startTime, endTime)) {
    e.reply("error", "/wrong-duration");
    console.log(
      "error wrong focus duration - either negative value or over 10h"
    );
    return;
  }

  focusStart(startTime, endTime);
});

ipcMain.on("focus-schedule-request", (e, { startTime, endTime }) => {
  console.log("schedule focus request from react", startTime, endTime);

  if (isOverlappingWithFocusSessions(startTime, endTime)) {
    e.reply("error", "/focus-overlap");
    console.log(
      "error scheduling focus session - overlap with current or future focus session"
    );
    return;
  }
  if (isWrongFocusDuration(startTime, endTime)) {
    e.reply("error", "/wrong-duration");
    console.log(
      "error wrong focus duration - either negative value or over 10h"
    );
    return;
  }

  scheduleFocus(startTime, endTime);
});

ipcMain.on("default-focus-start-request", (e) => {
  const settings = getSettings();
  const mediumDuration = settings.mediumFocusDuration;
  const now = new Date().getTime();

  focusStart(now, now + mediumDuration * 60 * 1000);
});

ipcMain.on("focus-end-request", (e) => {
  console.log("focus end request from react");
  // manually set the endTime of the focus session to the current time. This results in endTime != originalEndTime -> we can see which sessions were aborted manually
  setEndTime(new Date().getTime());
  focusEnd();
  // if focus end successful, update the react app
  e.reply("focus-end-successful");
});

ipcMain.on("focus-end-change-request", (e, minutes) => {
  console.log("extending focus duration");
  extendFocusDuration(minutes);
});

ipcMain.on("get-previous-focus-session", (e, args) => {
  e.reply("get-previous-focus-session", getPreviousFocusSession());
});

ipcMain.on("get-all-past-focus-sessions", (e, args) => {
  e.reply("get-all-past-focus-sessions", getAllFocusSessions());
});

ipcMain.on("cancel-future-focus-session", (e, sessionId) => {
  console.log("delete future session, id: ", sessionId);
  deleteFutureFocusSession(sessionId);
  // remove the timeout, so it does not get scheduled
  clearTimeout(getFutureFocusRef(sessionId));
  // delete calendar event as well -> that way it does not schedule again the next minute
  deleteCalendarEvent(sessionId);
  e.reply("get-all-future-focus-sessions", getAllFutureFocusSessions());
});

ipcMain.on("breakFocus", (e, breakFocusEnd) => {
  storeBreakFocusClicks(breakFocusEnd);
});

ipcMain.on("get-all-future-focus-sessions", (e, args) => {
  e.reply("get-all-future-focus-sessions", getAllFutureFocusSessions());
});

ipcMain.on("updateDefaultDuration", (e, { type, value }) => {
  storeDefaultFocusSession(type, value);
});
