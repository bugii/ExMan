const timeoutRefs = [];
const intervallRefs = [];
const futureFocusSessionsRefs = {};
let focusEndRef = null;
let mainWindow = null;
let isFocus = false;
let PORT;

function storeMainWindow(window) {
  mainWindow = window;
}

function getMainWindow() {
  return mainWindow;
}

function storeTimeoutRef(ref) {
  timeoutRefs.push(ref);
}

function getTimeoutRefs() {
  return timeoutRefs;
}

function storeIntervallRef(ref) {
  intervallRefs.push(ref);
}

function getIntervallRefs() {
  return intervallRefs;
}

function storeFocusEndRef(ref) {
  focusEndRef = ref;
}

function getFocusEndRef() {
  return focusEndRef;
}

function getFocus() {
  return isFocus;
}

function setFocus(bool) {
  isFocus = bool;
}

function storeFutureFocusRef(id, ref) {
  futureFocusSessionsRefs[id] = ref;
}

function getFutureFocusRef(id) {
  try {
    return futureFocusSessionsRefs[id];
  } catch (error) {
    return null;
  }
}

function getAllFutureFocusRefs() {
  const array = [];
  for (futureSessionRef in futureFocusSessionsRefs) {
    array.push(futureFocusSessionsRefs[futureSessionRef]);
  }
  return array;
}

function getPORT() {
  return PORT;
}

function storePORT(port) {
  PORT = port;
}

module.exports = {
  storeMainWindow,
  getMainWindow,
  storeTimeoutRef,
  getTimeoutRefs,
  storeIntervallRef,
  getIntervallRefs,
  storeFocusEndRef,
  getFocusEndRef,
  getFocus,
  setFocus,
  storeFutureFocusRef,
  getFutureFocusRef,
  getAllFutureFocusRefs,
  getPORT,
  storePORT,
};
