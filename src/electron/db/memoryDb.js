const timeoutRefs = [];
const intervallRefs = [];
let mainWindow = null;

function storeMainWindow(window) {
  mainWindow = window;
}

function getMainWindow() {
  return mainWindow;
}

function storeIntervallRef(ref) {
  intervallRefs.push(ref);
  console.log("stored intervall ref", ref);
}

function storeTimeoutRef(ref) {
  timeoutRefs.push(ref);
  console.log("stored timeout ref", ref);
}

function getIntervallRefs() {
  return intervallRefs;
}

function getTimeoutRefs() {
  return timeoutRefs;
}

module.exports = {
  storeMainWindow,
  getMainWindow,
  storeIntervallRef,
  storeTimeoutRef,
  getIntervallRefs,
  getTimeoutRefs,
};
