const { ipcMain } = require("electron");
const { getMainWindow } = require("../db/memoryDb");
const openService = require("../utils/openService");
const servicesManager = require("../services/ServicesManger");

ipcMain.on("notification", (event, { id, title, body }) => {
  if (!getFocus()) {
    console.log("forward notification", id);
    // forward notification
    // try to send it to renderer and use html notifcation api there
    getMainWindow().send("notification", { id, title, body });
    // Also store the notification in archive
    servicesManager.getService(id).handleNotification(false, title, body);
  } else {
    console.log("block notification", id);
    // if there is a focus session ongoing, store the notification
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
