const timeoutRefs = [];
const intervallRefs = [];
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
};
