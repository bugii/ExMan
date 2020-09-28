const timeoutRefs = [];
const intervallRefs = [];
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

function storeIntervallRefs(ref) {
  intervallRefs.push(ref)
}

function getIntervallRefs() {
  return intervallRefs
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
  storeIntervallRefs,
  getIntervallRefs,
  getFocus,
  setFocus,
};
