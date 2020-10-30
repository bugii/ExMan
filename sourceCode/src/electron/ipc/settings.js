const { ipcMain } = require("electron");
const { getSettings } = require("../db/db");

ipcMain.on("get-settings", (e) => {
  e.reply("get-settings", getSettings());
});
