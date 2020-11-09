const { ipcMain } = require("electron");
const { googleAuthRequest } = require("../auth/googleOAuth");
const { outlookAuthRequest } = require("../auth/outlookOAuth");
const removeCalendarConnection = require("../calendar/removeCalendarConnection");
const { getTokens } = require("../db/db");
const { getMainWindow } = require("../db/memoryDb");

ipcMain.on("outlook-cal-register-start", (e) => {
  console.log("start outlook registration");
  outlookAuthRequest();
});

ipcMain.on("google-cal-register-start", (e) => {
  console.log("start google registration");
  googleAuthRequest();
});

ipcMain.on("remove-calendar", (e) => {
  removeCalendarConnection();
  e.reply("tokens", getTokens());
});

module.exports = {
  calendarSuccessfullyAdded: (type) => {
    getMainWindow().send("calendar-successfully-added", type);
  },
};
