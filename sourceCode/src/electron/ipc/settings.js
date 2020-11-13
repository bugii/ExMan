const { ipcMain } = require("electron");
const { getSettings, setGoalFocusDuration } = require("../db/db");

ipcMain.on("get-settings", (e) => {
  e.reply("get-settings", getSettings());
});

ipcMain.on("updateFocusDurationGoal", (e, duration) => {
  setGoalFocusDuration(duration);
});
