const { toggleAutoResponseAvailablity } = require("../db/db");

const { webContents } = require("electron");
const { getFocus } = require("../db/memoryDb");

// This class is just here so that other services can extend this class
// Don't use this class itself

module.exports = class Service {
  webContentsId = null;
  intervallRefs = [];
  ready = false;
  authed = false;
  unreadCount = 0;
  loopStarted = false;

  constructor(id, name, autoResponse, checkIfAllAuthed) {
    this.id = id;
    this.name = name;
    this.autoResponse = autoResponse;
    this.checkIfAllAuthed = checkIfAllAuthed;
  }

  isInFocusSession() {
    return getFocus();
  }

  setAuthed(bool) {
    this.authed = bool;
    this.checkIfAllAuthed();
  }

  toggleAutoResponseAvailablity() {
    this.autoResponse = !this.autoResponse;
    // also set db
    toggleAutoResponseAvailablity(this.id);
  }

  setWebcontentsId(webContentsId) {
    this.webContentsId = webContentsId;
    this.ready = true;
  }

  startLoop() {
    if (!this.loopStarted) {
      this.loopStarted = true;
      this.unReadLoop();
      this.authLoop();
      this.messagesLoop();
    }
  }

  endLoop() {
    this.loopStarted = false;
    // Clear all the intervals
    this.intervallRefs.forEach((intervallRef) => {
      clearInterval(intervallRef);
    });
  }

  focusStart(diffMins) {
    console.log("starting focus in", this.name);
    webContents.fromId(this.webContentsId).setAudioMuted(true);
    this.setDnd(diffMins);
  }

  async focusEnd() {
    webContents.fromId(this.webContentsId).setAudioMuted(false);
    await this.setOnline();
    this.endLoop();
  }

  unReadLoop() {
    console.log("please overwrite unReadLoop", this.name);
  }

  authLoop() {
    console.log("please overwrite authLoop", this.name);
  }

  messagesLoop() {
    console.log("please overwrite messagesLoop", this.name);
  }

  setDnd(diffMins) {
    console.log("please overwrite setDnd", this.name);
  }

  async setOnline() {
    console.log("please overwrite setOnline", this.name);
  }

  getMessages(startTime) {
    console.log("please overwrite getMessages", this.name);
  }

  sendMessage(channel, message) {
    console.log("please overwrite sendMessage", this.name);
  }
};
