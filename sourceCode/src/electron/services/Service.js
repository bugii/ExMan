const {
  toggleAutoResponseAvailablity,
  storeNotificationInArchive,
  storeNotification,
} = require("../db/db");

const { webContents, session } = require("electron");
const { getFocus } = require("../db/memoryDb");

// This class is just here so that other services can extend this class
// Don't use this class itself

module.exports = class Service {
  webContentsId = null;
  intervallRefs = [];
  authLoopRef = null;
  unreadLoopRef = null;
  messagesLoopRef = null;
  ready = false;
  authed = false;
  unreadCount = 0;
  authLoopStarted = false;

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
    const old = this.authed;
    this.authed = bool;
    this.checkIfAllAuthed();

    if (bool && old !== bool) {
      // service coming from not authed state to authed state -> start other loops
      this.unReadLoop();
      this.messagesLoop();
    } else if (bool) {
      // just do nothing, service still authed
    } else {
      // service not authed anymore
      this.endUnreadLoop();
      this.endMessagesLoop();
    }
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
    if (!this.authLoopStarted) {
      this.authLoopStarted = true;
      this.authLoop();
    }
  }

  endAuthLoop() {
    clearInterval(this.authLoopRef);
  }
  endUnreadLoop() {
    clearInterval(this.unreadLoopRef);
  }
  endMessagesLoop() {
    clearInterval(this.messagesLoopRef);
  }

  focusStart() {
    console.log("starting focus in", this.name);
    webContents.fromId(this.webContentsId).setAudioMuted(true);
    this.setDnd();
  }

  async focusEnd() {
    webContents.fromId(this.webContentsId).setAudioMuted(false);
    await this.setOnline();
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

  handleNotification(isFoucs, title, body) {
    // by default, store notifications in db. Overwrite this function for services where we store messages in database (such as teams/slack)
    if (isFoucs) {
      storeNotification(this.id, title, body);
    } else {
      storeNotificationInArchive(this.id, title);
    }
  }

  clearSession() {
    console.log(`cleaning ${this.name} session`);
    const ses = session.fromPartition(`persist:${this.id}`);
    ses.clearStorageData({
      storages: [
        "appcache",
        "serviceworkers",
        "cachestorage",
        "websql",
        "indexdb",
      ],
    });
  }
};
