const { ipcMain } = require("electron");
const {
  setRating,
    setComments,
  setCompletedGoalsAfterSession,
} = require("../db/db");

ipcMain.on(
  "previous-session-update",
  (e, { rating, completedGoals, comments }) => {
    console.log("previous session update");
    // submit rating value to focus session
    setRating(rating);
    // update goals with which were accomplished
    setCompletedGoalsAfterSession(completedGoals);
    // set comments
    setComments(comments);
  }
);
