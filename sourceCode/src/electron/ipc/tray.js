const { ipcMain } = require("electron");
const createOrUpdateTray = require("../utils/createOrUpdateTray");

ipcMain.on("update-tray", () => {
  createOrUpdateTray();
});
