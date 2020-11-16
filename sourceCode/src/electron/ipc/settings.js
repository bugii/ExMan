const { ipcMain } = require("electron");
const {
  getSettings,
  setGoalFocusDuration,
  updateTeamsCall,
  setGoalperDay,
} = require("../db/db");

ipcMain.on("get-settings", (e) => {
  e.reply("get-settings", getSettings());
});

ipcMain.on("updateFocusDurationGoal", (e, duration) => {
  setGoalFocusDuration(duration);
});

ipcMain.on("updateTeamsCall", (e, state) => {
  updateTeamsCall(state);
});

ipcMain.on("updateGoalTarget", (e, goals) => {
  setGoalperDay(goals);
});
