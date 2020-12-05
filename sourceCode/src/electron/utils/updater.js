const { autoUpdater } = require("electron-updater");
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

module.exports = async () => {
  // check for updates (Github Releases)
  try {
    await autoUpdater.checkForUpdatesAndNotify();
  } catch (error) {
    console.log(error);
  }
};
