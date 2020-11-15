const fs = require("fs");
const { dialog, app, shell } = require("electron");
const path = require("path");

const {
  getAllFocusSessions,
  getOutOfFocusMessages,
  getRandomSurveyResults,
  getDb,
  getSettings,
} = require("../db/db");
const { getMainWindow } = require("../db/memoryDb");
const { destroyExportWindow } = require("./exportHelper");

module.exports = async () => {
  const outOfFocusMessages = getOutOfFocusMessages();
  const randomSurveyResults = getRandomSurveyResults();
  const outOfFocusInteractions = getDb().get("outOfFocusInteractions").value();
  const outOfFocusActiveWindows = getDb()
    .get("outOfFocusActiveWindows")
    .value();
  const appUsage = getDb().get("appUsage").value();
  const settings = getSettings();

  const hashedOutOfFocusMessages = hashOutOfFocusMessageTitles(
    outOfFocusMessages
  );

  const output = {
    focusSessions: [],
    outOfFocusMessages: hashedOutOfFocusMessages,
    randomSurveyResults,
    outOfFocusInteractions,
    outOfFocusActiveWindows,
    appUsage,
    settings,
  };

  const focusSessions = getAllFocusSessions();

  focusSessions.forEach((focusSession) => {
    const anonymizedVersion = {
      ...focusSession,
      services: [],
    };

    focusSession.services.forEach((service) => {
      const hashedMessages = hashInFocusMessageTitles(service.messages);

      anonymizedVersion["services"].push({
        id: service.id,
        name: service.name,
        unreadCount: service.unreadCount,
        autoReplied: service.autoReplied,
        messages: hashedMessages,
        interactions: service.interactions,
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
        // Open the file for them to review
        shell.openExternal("file://" + res.filePath);
        destroyExportWindow();
      }
    });
  }
};

const hashCode = (s) =>
  s.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);

const hashInFocusMessageTitles = (messages) => {
  const hashedMessages = [];
  messages.forEach((message) => {
    const sender = message.title;
    // hash the sender
    const hashedSender = hashCode(sender);
    hashedMessages.push({ timestamp: message.timestamp, title: hashedSender });
  });
  return hashedMessages;
};

const hashOutOfFocusMessageTitles = (servicesMessages) => {
  const hashedMessages = {};
  for (service in servicesMessages) {
    hashedMessages[service] = {
      name: servicesMessages[service].name,
      messages: [],
    };

    servicesMessages[service]["messages"].forEach((message) => {
      const sender = message.title;
      const hashedSender = hashCode(sender);

      hashedMessages[service]["messages"].push({
        timestamp: message.timestamp,
        title: hashedSender,
      });
    });
  }
  return hashedMessages;
};
