const fs = require("fs");
const { dialog, app } = require("electron");
const path = require("path");

const {
  getAllFocusSessions,
  getOutOfFocusMessages,
  getRandomSurveyResults,
} = require("../db/db");
const { getMainWindow } = require("../db/memoryDb");

module.exports = async () => {
  const outOfFocusMessages = getOutOfFocusMessages();
  const randomSurveyResults = getRandomSurveyResults();

  const output = { focusSessions: [], outOfFocusMessages, randomSurveyResults };

  const focusSessions = getAllFocusSessions();

  focusSessions.forEach((focusSession) => {
    const anonymizedVersion = {
      ...focusSession,
      services: [],
    };

    focusSession.services.forEach((service) => {
      anonymizedVersion["services"].push({
        id: service.id,
        name: service.name,
        unreadCount: service.unreadCount,
        autoReplied: service.autoReplied,
        messages: service.messages.length,
        inFocusModeClicks: service.inFocusModeClicks,
      });
    });

    output["focusSessions"].push(anonymizedVersion);
  });

  const res = await dialog.showSaveDialog(getMainWindow(), {
    title: "Exporting",
    defaultPath: path.join(
      app.getPath("desktop"),
      `ex-man-export-${new Date().getTime()}.json`
    ),
  });

  if (res.filePath) {
    fs.writeFile(res.filePath, JSON.stringify(output), (err) => {
      if (err) console.log(err);
      else {
        console.log(`successfully saved ${res.filePath} to disk`);
      }
    });
  }
};
