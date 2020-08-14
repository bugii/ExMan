const { app } = require("electron");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync(path.join(app.getPath("userData"), "db.json"));
const db = low(adapter);

function getDb() {
  return db;
}

function init() {
  console.log("initializing db");
  // Default is just slack installed, can be removed once we have functionality to add services
  // WebContents will be added as soon as the webview is attached to the DOM
  if (!db.has("services").value()) {
    db.set("services", []).write();
  }

  if (!db.has("focusSessions").value()) {
    db.set("focusSessions", []).write();
  }

  if (!db.has("currentFocusSession").value()) {
    db.set("currentFocusSession", null).write();
  }

  return db;
}

function addService(name) {
  const id = uuidv4();

  db.get("services")
    .push({
      id,
      name,
      webContentsId: null,
    })
    .write();

  return getServices();
}

function getServices() {
  return db.get("services").value();
}

function deleteService(id) {
  db.get("services").remove({ id }).write();
  return getServices();
}

module.exports = {
  init,
  getDb,
  addService,
  getServices,
  deleteService,
};
