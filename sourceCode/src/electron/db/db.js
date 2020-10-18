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

  if (!db.has("randomSurveyResults").value()) {
    db.set("randomSurveyResults", []).write();
  }

  // set default auto-response message, if not present
  if (!db.has("settings").value()) {
    db.set("settings", {
      autoReply:
        "Currently, I am working in focus mode. I will answer you earliest in ${time}.",
      shortFocusDuration: 15,
      mediumFocusDuration: 25,
      longFocusDuration: 40,
    }).write();
  }

  if (!db.has("appUsage").value()) {
    db.set("appUsage", []).write();
  }

  if (!db.has("activeWindows").value()) {
    db.set("activeWindows", []).write();
  }

  if (!db.has("interactions").value()) {
    db.set("interactions", {}).write();
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
    interactions: [],
  }));

  const id = uuidv4();

  db.set("currentFocusSession", {
    id,
    startTime,
    endTime,
    originalEndTime: endTime,
    services,
    brokenFocus: [],
    goals: [],
    completedGoals: [],
    rating: null,
    scheduled: false,
    activeWindows: [],
  }).write();
}

function createNewFutureFocusSession(startTime, endTime) {
  const id = uuidv4();

  db.get("futureFocusSessions")
    .push({
      id,
      startTime,
      endTime,
      scheduled: true,
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
  db.get("currentFocusSession").assign({ goals }).write();
}

function setCompletedGoals(completedGoals) {
  db.get("currentFocusSession").assign({completedGoals}).write();
}

function setRating(rating) {
  db.get("pastFocusSessions").last().assign({ rating }).write();
}

function storeBreakFocusClicks(breakFocusEnd) {
  if (!breakFocusEnd) {
    db.get("currentFocusSession").get("brokenFocus").push([Date.now()]).write();
  } else {
    db.get("currentFocusSession")
      .get("brokenFocus")
      .last()
      .push(Date.now())
      .write();
  }
}

function updateBreakFocusPerService(id) {
  if (getCurrentFocusSession() != null) {
    db.get("currentFocusSession")
      .get("services")
      .find({ id })
      .update("inFocusModeClicks", (n) => n + 1)
      .write();
  }
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
    .push({ title, body, timestamp: new Date().getTime() })
    .write();
}

function storeNotificationInArchive(id) {
  const hasMessages = db.get("messagesOutOfFocus").has(id).value();
  const serviceName = db.get("services").find({ id }).get("name").value();

  if (!hasMessages) {
    db.get("messagesOutOfFocus")
      .assign({ [id]: { name: serviceName, messages: [] } })
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

function storeRandomSurveyResults({ productivity }) {
  db.get("randomSurveyResults")
    .push({
      timestamp: new Date().getTime(),
      productivity,
    })
    .write();
}

function getOutOfFocusMessages() {
  return db.get("messagesOutOfFocus").value();
}

function getRandomSurveyResults() {
  return db.get("randomSurveyResults").value();
}

function storeDefaultFocusSession(type, value) {
  switch (type) {
    case "short":
      db.get("settings").assign({ shortFocusDuration: value }).write();
      break;
    case "medium":
      db.get("settings").assign({ mediumFocusDuration: value }).write();
      break;

    case "long":
      db.get("settings").assign({ longFocusDuration: value }).write();
      break;

    default:
      break;
  }
}

function getSettings() {
  return db.get("settings").value();
}

function storeAppStart() {
  db.get("appUsage").push([new Date().getTime()]).write();
}

function storeAppEnd() {
  db.get("appUsage").last().push(new Date().getTime()).write();
}

function storeActiveWindowInCurrentFocus({ name, title }) {
  // get the last entry and check if anything has changed.. if not -> don't add another entry
  const lastWindow = db.get("activeWindows").last().value();

  if (lastWindow.name !== name || lastWindow.title !== title) {
    db.get("currentFocusSession")
      .get("activeWindows")
      .push({ timestamp: new Date().getTime(), name, title })
      .write();
  }
}

function storeActiveWindowInArchive({ name, title }) {
  // get the last entry and check if anything has changed.. if not -> don't add another entry
  const lastWindow = db.get("activeWindows").last().value();

  if (lastWindow.name !== name || lastWindow.title !== title) {
    db.get("activeWindows")
      .push({ timestamp: new Date().getTime(), name, title })
      .write();
  }
}

function storeServiceInteractionStartInCurrentFocus(id) {
  db.get("currentFocusSession")
    .get("services")
    .find({ id })
    .get("interactions")
    .push([new Date().getTime()])
    .write();
}

function storeServiceInteractionEndInCurrentFocus(id) {
  db.get("currentFocusSession")
    .get("services")
    .find({ id })
    .get("interactions")
    .last()
    .push(new Date().getTime())
    .write();
}

function storeServiceInteractionStartInArchive(id) {
  const hasInteractions = db.get("interactions").has(id).value();
  const serviceName = db.get("services").find({ id }).get("name").value();

  if (!hasInteractions) {
    db.get("interactions")
      .assign({ [id]: { name: serviceName, interactions: [] } })
      .write();
  }

  db.get("interactions")
    .get(id)
    .get("interactions")
    .push([new Date().getTime()])
    .write();
}

function storeServiceInteractionEndInArchive(id) {
  db.get("interactions")
    .get(id)
    .get("interactions")
    .last()
    .push(new Date().getTime())
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
  setCompletedGoals,
  setRating,
  toggleAutoResponseAvailablity,
  storeNotification,
  storeNotificationInArchive,
  setUnreadChats,
  storeBreakFocusClicks,
  updateBreakFocusPerService,
  storeRandomSurveyResults,
  getOutOfFocusMessages,
  getRandomSurveyResults,
  storeDefaultFocusSession,
  getSettings,
  storeAppStart,
  storeAppEnd,
  storeActiveWindowInCurrentFocus,
  storeActiveWindowInArchive,
  storeServiceInteractionStartInCurrentFocus,
  storeServiceInteractionEndInCurrentFocus,
  storeServiceInteractionStartInArchive,
  storeServiceInteractionEndInArchive,
};
