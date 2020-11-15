const { ipcMain } = require("electron");
const {
  setRating,
  setCompletedGoalsAfterSession,
  setChatWorkRelated,
} = require("../db/db");

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
