const { BrowserWindow } = require("electron");
const path = require("path");

let exportWindow;

function createExportWindow() {
  exportWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  });
  exportWindow.loadFile(path.join(__dirname, "../sites/export.html"));
}

function destroyExportWindow() {
  exportWindow.destroy();
}

module.exports = {
  createExportWindow,
  destroyExportWindow,
};
