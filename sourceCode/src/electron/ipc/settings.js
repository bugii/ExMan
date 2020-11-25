const { ipcMain } = require("electron");
const {
  getSettings,
  setGoalFocusDuration,
  updateTeamsCall,
  setGoalperDay,
  changeAppVersion,
  getDistractingWebsites,
  getDistractingApps,
  updateDistractingWebsites,
  updateDistractingApps,
} = require("../db/db");

ipcMain.on("get-settings", (e) => {
  e.reply("get-settings", getSettings());
});

ipcMain.on("updateFocusDurationGoal", (e, duration) => {
  setGoalFocusDuration(duration);
});

ipcMain.on("updateTeamsCall", (e, state) => {
  // db function updateTeamsCall changes boolean of state
  updateTeamsCall(state);
});

ipcMain.on("updateGoalTarget", (e, goals) => {
  setGoalperDay(goals);
});

ipcMain.on("application-update-request", (e, password) => {
  console.log("application version change request with pw", password);
  changeAppVersion(password);
});

ipcMain.on("distracting-websites", (e) => {
  e.reply("distracting-websites", getDistractingWebsites());
});

ipcMain.on("update-distracting-websites", (e, websites) => {
  updateDistractingWebsites(websites);
});

ipcMain.on("distracting-apps", (e) => {
  e.reply("distracting-apps", getDistractingApps());
});

ipcMain.on("update-distracting-apps", (e, apps) => {
  updateDistractingApps(apps);
});
