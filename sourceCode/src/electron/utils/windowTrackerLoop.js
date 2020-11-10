const activeWin = require("active-win");
const {
  storeActiveWindowInArchive,
  storeActiveWindowInCurrentFocus,
} = require("../db/db");
const { storeIntervallRef, getFocus } = require("../db/memoryDb");

module.exports = () => {
  const windowTrackerIntervall = setInterval(async () => {
    const activeWindow = await activeWin();
    if (activeWindow) {
      if (getFocus()) {
        storeActiveWindowInCurrentFocus({
          name: activeWindow.owner.name,
          title: activeWindow.title,
        });
      } else {
        storeActiveWindowInArchive({
          name: activeWindow.owner.name,
          title: activeWindow.title,
        });
      }
    }
  }, 10000);
  storeIntervallRef(windowTrackerIntervall);
};
