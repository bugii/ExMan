const activeWin = require("active-win");
const {
  storeActiveWindowInArchive,
  storeActiveWindowInCurrentFocus,
  getSettings,
  getDistractingApps,
} = require("../db/db");
const {
  storeIntervallRef,
  getFocus,
  getMainWindow,
} = require("../db/memoryDb");

const distractingApps = getDistractingApps();

let lastReminded;

module.exports = () => {
  const windowTrackerIntervall = setInterval(async () => {
    const activeWindow = await activeWin();
    const currentTime = new Date().getTime();
    if (activeWindow) {
      const isDistraction = checkForDistractingApps(activeWindow.title);

      if (getFocus()) {
        if (isDistraction && getSettings().appVersion === "exman") {
          // Discourage the user from continuing on this website by showing him a notification
          if (!lastReminded || lastReminded + 1 * 60000 < currentTime) {
            getMainWindow().send("distraction-notification");
            lastReminded = currentTime;
          }
        }

        storeActiveWindowInCurrentFocus({
          name: activeWindow.owner.name,
          title: activeWindow.title,
          isDistraction,
        });
      } else {
        storeActiveWindowInArchive({
          name: activeWindow.owner.name,
          title: activeWindow.title,
          isDistraction,
        });
      }
    }
  }, 10000);
  storeIntervallRef(windowTrackerIntervall);
};

const checkForDistractingApps = (title, url) => {
  //console.log("title", title, "url", url);
  const lowerCaseTitle = title.toLowerCase();

  // no url, handle distracting applications/websites via title property
  for (const distractingApp of distractingApps) {
    if (lowerCaseTitle.includes(distractingApp)) {
      return true;
    }
  }
  return false;
};
