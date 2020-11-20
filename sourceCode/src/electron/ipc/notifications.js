const { ipcMain } = require("electron");
const { getMainWindow, getFocus } = require("../db/memoryDb");
const openService = require("../utils/openService");
const servicesManager = require("../services/ServicesManger");
const { getSettings } = require("../db/db");

ipcMain.on("notification", (event, { id, title, body }) => {
  if (!getFocus()) {
    console.log("forward notification", id);
    // forward notification
    getMainWindow().send("notification", { id, title, body });
    // Also store the notification in archive
    servicesManager.getService(id).handleNotification(false, title, body);
  } else {
    // in focus and appversion == exman
    if (getSettings().appVersion === "exman") {
      console.log("block notification", id);
      // if there is a focus session ongoing, store the notification
    } else {
      // pomodoro version
      console.log("forward notification", id);
      // forward notification
      getMainWindow().send("notification", { id, title, body });
    }

    servicesManager.getService(id).handleNotification(true, title, body);
  }
});

ipcMain.on("notification-clicked", (e, id) => {
  console.log("clicked on notification", id);
  getMainWindow().restore();
  getMainWindow().show();
  openService(id);
});

ipcMain.on("callChecker-send", (e, { id }) => {
  // display notification
  getMainWindow().send("notification", {
    id: id,
    title: "you got a call from teams",
    body: " press on the notification to move to the teams page.",
  });
});
