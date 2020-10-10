const { getMainWindow } = require("../db/memoryDb");

module.exports = () => {
  const mainWindow = getMainWindow();
  const isMinimized = mainWindow.isMinimized();
  if (isMinimized) {
    mainWindow.restore();
  }
  mainWindow.show();
  mainWindow.focus();

  return isMinimized;
};
