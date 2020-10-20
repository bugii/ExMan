const { autoUpdater } = require("electron-updater");

module.exports = async () => {
  // check for updates (Github Releases)
  console.log("Checking for updates");
  const updateRes = await autoUpdater.checkForUpdatesAndNotify();
  console.log(updateRes);
};
