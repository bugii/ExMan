const { ipcMain } = require("electron");
const { getAppUsedData } = require("../db/db");

ipcMain.on("appUsage-statistic", (e, message) => {
  e.reply("appUsage-statistic", getAppUsedData());
});
