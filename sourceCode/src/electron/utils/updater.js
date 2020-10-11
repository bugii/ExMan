const { autoUpdater } = require("electron-updater");

module.exports = () => {
  // check for updates (Github Releases)
  console.log("Checking for updates");
  autoUpdater.checkForUpdatesAndNotify();
};
