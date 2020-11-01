const { ipcMain } = require("electron");
const { googleAuthRequest } = require("../auth/googleOAuth");
const { outlookAuthRequest } = require("../auth/outlookOAuth");
const { getMainWindow } = require("../db/memoryDb");

ipcMain.on("outlook-cal-register-start", (e) => {
  console.log("start outlook registration");
  outlookAuthRequest();
});

ipcMain.on("google-cal-register-start", (e) => {
  console.log("start google registration");
  googleAuthRequest();
});

module.exports = {
  calendarSuccessfullyAdded: (type) => {
    getMainWindow().send("calendar-successfully-added", type);
  },
};
