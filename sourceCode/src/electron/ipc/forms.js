const { ipcMain } = require("electron");
const {
  setRating,
  setCompletedGoalsAfterSession,
  setChatWorkRelated,
  storeRandomSurveyResults,
} = require("../db/db");
const { getMainWindow } = require("../db/memoryDb");
const scheduleRandomPopup = require("../utils/scheduleRandomPopup");

ipcMain.on(
  "previous-session-update",
  (e, { rating, completedGoals, chatWorkRelated }) => {
    console.log("previous session update");
    // submit rating value to focus session
    setRating(rating);
    // update goals with which were accomplished
    setCompletedGoalsAfterSession(completedGoals);
    // set work related chat
    setChatWorkRelated(chatWorkRelated);
  }
);

ipcMain.on("random-popup-submission", (e, { productivity, wasMinimized }) => {
  console.log(`random popup survey submission, productivity: ${productivity}`);
  storeRandomSurveyResults({ productivity });
  if (wasMinimized) {
    getMainWindow().minimize();
  }
  scheduleRandomPopup();
});
