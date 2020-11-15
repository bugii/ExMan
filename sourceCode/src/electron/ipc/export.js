const { ipcMain } = require("electron");
const exportDb = require("../utils/exportDb");

ipcMain.on("export-db", () => {
  exportDb();
});
