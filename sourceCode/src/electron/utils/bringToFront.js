const { getMainWindow } = require("../db/memoryDb");

module.exports = () => {
  const mainWindow = getMainWindow();
  mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
};
