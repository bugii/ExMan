const { app } = require("electron");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const { write } = require("lowdb/adapters/FileSync");

const adapter = new FileSync(path.join(app.getPath("userData"), "db.json"));
const db = low(adapter);

function getDb() {
  return db;
}

function init() {
  console.log("initializing db");
  if (!db.has("services").value()) {
    db.set("services", []).write();
  }

  db.get("services")
    .map((el) => (el["webContentsId"] = null))
    .write();
  db.get("services")
    .map((el) => (el["ready"] = false))
    .write();
  db.get("services")
    .map((el) => (el["authed"] = false))
    .write();

  if (!db.has("pastFocusSessions").value()) {
    db.set("pastFocusSessions", []).write();
  }

  // On startup no focus session can be active
  db.set("currentFocusSession", null).write();

  if (!db.has("futureFocusSessions").value()) {
    db.set("futureFocusSessions", []).write();
  }

  return db;
}

function addService(name) {
  const id = uuidv4();
  // WebContents will be added as soon as the webview is attached to the DOM
  db.get("services")
    .push({
      id,
      name,
      webContentsId: null,
      unreadCount: 0,
      ready: false,
      authed: false,
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

function createNewFocusSession(startTime, endTime) {
  // Check which services were active at the start of the focus session
  let services = getServices();
  // add additional fields to each service: 'lastUpdated', 'autoReplied', and a 'messages' array to store new messages that arrive during focus mode
  services = services.map((service) => ({
    ...service,
    lastUpdated: startTime,
    autoReplied: [],
    messages: [],
  }));

  const id = uuidv4();
  const goals = [];

  db.set("currentFocusSession", {
    id,
    startTime,
    endTime,
    originalEndTime: endTime,
    services,
    goals,
  }).write();
}

function createNewFutureFocusSession(startTime, endTime) {
  const id = uuidv4();

  db.get("futureFocusSessions")
    .push({
      id,
      startTime,
      endTime,
    })
    .write();

  return id;
}

function getCurrentFocusSession() {
  return db.get("currentFocusSession").value();
}

function endCurrentFocusSession() {
  // Move from currentFocusSession to pastFocusSessions collection
  const currentFocusSession = getCurrentFocusSession();
  db.get("pastFocusSessions").push(currentFocusSession).write();
  // Set current focus session to null again
  db.set("currentFocusSession", null).write();
}

function deleteFutureFocusSession(id) {
  db.get("futureFocusSessions").remove({ id }).write();
}

function getPreviousFocusSession() {
  return db.get("pastFocusSessions").last().value();
}

function getAllFocusSessions() {
  return db.get("pastFocusSessions").value();
}

function getAllFutureFocusSessions() {
  return db.get("futureFocusSessions").value();
}

function setEndTime(timestamp) {
  db.get("currentFocusSession").assign({ endTime: timestamp }).write();
}

function setFocusGoals(goals) {
  db.get("currentFocusSession").assign({ goals: goals }).write();
}

module.exports = {
  init,
  getDb,
  addService,
  getServices,
  deleteService,
  createNewFocusSession,
  createNewFutureFocusSession,
  getCurrentFocusSession,
  endCurrentFocusSession,
  deleteFutureFocusSession,
  getPreviousFocusSession,
  getAllFocusSessions,
  getAllFutureFocusSessions,
  setEndTime,
  setFocusGoals,
};
