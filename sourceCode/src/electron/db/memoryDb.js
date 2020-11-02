const timeoutRefs = [];
const intervallRefs = [];
const futureFocusSessionsRefs = {};
let focusEndRef = null;
let mainWindow = null;
let isFocus = false;

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
  PORT: 4000,
};
