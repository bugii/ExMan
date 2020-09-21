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
  if (!db.has("services").value()) {
    db.set("services", []).write();
  }

  if (!db.has("pastFocusSessions").value()) {
    db.set("pastFocusSessions", []).write();
  }

  if (!db.has("futureFocusSessions").value()) {
    db.set("futureFocusSessions", []).write();
  }

  if (!db.has("messagesOutOfFocus").value()) {
    db.set("messagesOutOfFocus", {}).write();
  }

  // set default auto-response message, if not present
  if (!db.has("settings").value()) {
    db.set("settings", {
      autoReply:
        "Currently, I am working in focus mode. I will answer you as soon as possible.",
    }).write();
  }

  return db;
}

function addService(service) {
  // WebContents will be added as soon as the webview is attached to the DOM
  db.get("services")
    .push({
      id: service.id,
      name: service.name,
      autoResponse: service.autoResponse,
    })
    .write();
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
    id: service.id,
    name: service.name,
    unreadCount: 0,
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

function getAutoresponse() {
  return db.get("settings.autoReply").value();
}

function updateAutoresponse(newResponse) {
  db.get("settings").assign({ autoReply: newResponse }).write();
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

function toggleAutoResponseAvailablity(id) {
  let currentState = db
    .get("services")
    .find({ id })
    .get("autoResponse")
    .value();
  currentState = !currentState;
  db.get("services")
    .find({ id })
    .assign({ autoResponse: currentState })
    .write();
  return currentState;
}

function storeNotification(id, title, body) {
  db.get("currentFocusSession")
    .get("services")
    .find({ id })
    .get("messages")
    .push({ title, body })
    .write();
}

function storeNotificationInArchive(id) {
  const hasMessages = db.get("messagesOutOfFocus").has(id).value();

  if (!hasMessages) {
    db.get("messagesOutOfFocus")
      .assign({ [id]: { messages: [] } })
      .write();
  }

  db.get("messagesOutOfFocus")
    .get(id)
    .get("messages")
    .push(new Date().getTime())
    .write();
}

function setUnreadChats(id, number) {
  db.get("currentFocusSession")
    .get("services")
    .find({ id })
    .assign({ unreadCount: number })
    .write();
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
  getAutoresponse,
  updateAutoresponse,
  getAllFutureFocusSessions,
  setEndTime,
  setFocusGoals,
  toggleAutoResponseAvailablity,
  storeNotification,
  storeNotificationInArchive,
  setUnreadChats,
};
