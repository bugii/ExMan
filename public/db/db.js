const { app } = require("electron");
const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync(path.join(app.getPath("userData"), "db.json"));
const db = low(adapter);

function init() {
  console.log("initializing db");
  // Default is just slack installed, can be removed once we have functionality to add services
  // WebContents will be added as soon as the webview is attached to the DOM
  db.set("services", [
    { name: "slack", webContentsId: null },
    { name: "teams", webContentsId: null },
    { name: "whatsapp", webContentsId: null },
    { name: "skype", webContentsId: null },
  ]).write();

  if (!db.has("focusSessions").value()) {
    db.set("focusSessions", []).write();
  }

  return db;
}

function getDb() {
  return db;
}

module.exports = {
  init,
  getDb,
};
