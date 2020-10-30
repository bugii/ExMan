const { ipcMain } = require("electron");
const {
  setFocusGoals,
  setCompletedGoals,
  getCurrentFocusSession,
} = require("../db/db");

ipcMain.on("focus-goals-request", (e, { goals, completedGoals }) => {
  console.log("focus goal request from react", goals);
  setFocusGoals(goals);
  setCompletedGoals(completedGoals);
  // if focus goals were set successfully, update the react app
  e.reply("current-focus-request", getCurrentFocusSession());
});
