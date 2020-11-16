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

  if (!db.has("outOfFocusMessages").value()) {
    db.set("outOfFocusMessages", {}).write();
  }

  // set default auto-response message, if not present
  if (!db.has("settings").value()) {
    db.set("settings", {
      autoReply:
        "Currently, I am working in focus mode. I will answer you earliest in ${time}.",
      shortFocusDuration: 15,
      mediumFocusDuration: 25,
      longFocusDuration: 40,
      focusGoalDuration: 120,
      teamsCallFocusAbility: false,
      minimumGoalsPerDay: 5,
    }).write();
  }

  if (!db.has("appUsage").value()) {
    db.set("appUsage", []).write();
  }

  if (!db.has("outOfFocusActiveWindows").value()) {
    db.set("outOfFocusActiveWindows", []).write();
  }

  if (!db.has("outOfFocusInteractions").value()) {
    db.set("outOfFocusInteractions", {}).write();
  }

  if (!db.has("tokens").value()) {
    db.set("tokens", {}).write();
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
      url: service.url,
      isOther: service.isOther,
      customName: null,
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
    ...service,
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
    chatWorkRelated: false,
    activeWindows: [],
  }).write();
}

function createNewFutureFocusSession(startTime, endTime, id) {
  db.get("futureFocusSessions")
    .push({
      id,
      startTime,
      endTime,
    })
    .write();
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

function deleteAllFutureFocusSessions() {
  db.set("futureFocusSessions", []).write();
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

function getSingleFutureFocusSession(id) {
  return db.get("futureFocusSessions").find({ id }).value();
}

function moveFutureSessionToCurrent(id) {
  const futureSession = db.get("futureFocusSessions").find({ id }).value();
  // remove in future
  db.get("futureFocusSessions").remove({ id }).write();

  let services = getServices();
  // add additional fields to each service: 'lastUpdated', 'autoReplied', and a 'messages' array to store new messages that arrive during focus mode
  services = services.map((service) => ({
    ...service,
    unreadCount: 0,
    autoReplied: [],
    messages: [],
    interactions: [],
  }));

  db.set("currentFocusSession", {
    id,
    startTime: futureSession.startTime,
    endTime: futureSession.endTime,
    originalEndTime: futureSession.endTime,
    scheduled: true,
    services,
    brokenFocus: [],
    goals: [],
    completedGoals: [],
    rating: null,
    chatWorkRelated: false,
    activeWindows: [],
  }).write();
}

function setEndTime(timestamp) {
  db.get("currentFocusSession").assign({ endTime: timestamp }).write();
}

function setFocusGoals(goals) {
  db.get("currentFocusSession").assign({ goals }).write();
}

function setCompletedGoals(completedGoals) {
  db.get("currentFocusSession").assign({ completedGoals }).write();
}

function setCompletedGoalsAfterSession(completedGoals) {
  db.get("pastFocusSessions").last().assign({ completedGoals }).write();
}

function setRating(rating) {
  db.get("pastFocusSessions").last().assign({ rating }).write();
}

function setChatWorkRelated(chatWorkRelated) {
  db.get("pastFocusSessions").last().assign({ chatWorkRelated }).write();
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

function getAppUsedData() {
  const appUsage = db.get("appUsage").value();
  return appUsage.slice(0, appUsage.length - 1);
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

function storeNotificationInArchive(id, title) {
  const hasMessages = db.get("outOfFocusMessages").has(id).value();
  const serviceName = db.get("services").find({ id }).get("name").value();

  if (!hasMessages) {
    db.get("outOfFocusMessages")
      .assign({ [id]: { name: serviceName, messages: [] } })
      .write();
  }

  db.get("outOfFocusMessages")
    .get(id)
    .get("messages")
    .push({ timestamp: new Date().getTime(), title })
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
  return db.get("outOfFocusMessages").value();
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

function getLastAppStartTime() {
  return db.get("appUsage").last().value()[0];
}

function storeActiveWindowInCurrentFocus({ name, title, isDistraction }) {
  // get the last entry and check if anything has changed.. if not -> don't add another entry
  const lastWindow = db
    .get("currentFocusSession")
    .get("activeWindows")
    .last()
    .value();

  if (!lastWindow) {
    db.get("currentFocusSession")
      .get("activeWindows")
      .push({ timestamp: new Date().getTime(), name, title, isDistraction })
      .write();
    return;
  }

  if (lastWindow.name !== name || lastWindow.title !== title) {
    db.get("currentFocusSession")
      .get("activeWindows")
      .push({ timestamp: new Date().getTime(), name, title, isDistraction })
      .write();
  }
}

function storeActiveWindowInArchive({ name, title, isDistraction }) {
  // get the last entry and check if anything has changed.. if not -> don't add another entry
  const lastWindow = db.get("outOfFocusActiveWindows").last().value();

  if (!lastWindow) {
    db.get("outOfFocusActiveWindows")
      .push({ timestamp: new Date().getTime(), name, title, isDistraction })
      .write();
    return;
  }

  if (lastWindow.name !== name || lastWindow.title !== title) {
    db.get("outOfFocusActiveWindows")
      .push({ timestamp: new Date().getTime(), name, title, isDistraction })
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
  const hasInteractions = db.get("outOfFocusInteractions").has(id).value();
  const serviceName = db.get("services").find({ id }).get("name").value();

  if (!hasInteractions) {
    db.get("outOfFocusInteractions")
      .assign({ [id]: { name: serviceName, interactions: [] } })
      .write();
  }

  db.get("outOfFocusInteractions")
    .get(id)
    .get("interactions")
    .push([new Date().getTime()])
    .write();
}

function storeServiceInteractionEndInArchive(id) {
  db.get("outOfFocusInteractions")
    .get(id)
    .get("interactions")
    .last()
    .push(new Date().getTime())
    .write();
}

function storeTokens(provider, { access_token, refresh_token, expires_in }) {
  db.set("tokens", {
    [provider]: { access_token, refresh_token, expires_in },
  }).write();
}

function getTokens() {
  return db.get("tokens").value();
}

function setGoalFocusDuration(duration) {
  db.get("settings").assign({ focusGoalDuration: duration }).write();
}

function setGoalperDay(goals) {
  db.get("settings").assign({ minimumGoalsPerDay: goals }).write();
}

function deleteTokens() {
  db.set("tokens", {}).write();
}

function updateTeamsCall(newResponse) {
  db.get("settings").assign({ teamsCallFocusAbility: !newResponse }).write();
}

function updateWorkspaceName(id, customName) {
  db.get("services").find({ id }).assign({ customName: customName }).write();
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
  deleteAllFutureFocusSessions,
  getSingleFutureFocusSession,
  getPreviousFocusSession,
  getAllFocusSessions,
  getAutoresponse,
  updateAutoresponse,
  getAllFutureFocusSessions,
  setEndTime,
  setFocusGoals,
  setCompletedGoals,
  setCompletedGoalsAfterSession,
  setRating,
  setChatWorkRelated,
  setGoalFocusDuration,
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
  storeTokens,
  getTokens,
  getAppUsedData,
  moveFutureSessionToCurrent,
  getLastAppStartTime,
  deleteTokens,
  updateTeamsCall,
  updateWorkspaceName,
  setGoalperDay,
};
