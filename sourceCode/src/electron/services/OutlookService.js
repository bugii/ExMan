const { webContents } = require("electron");

const Service = require("../services/Service");
const { setUnreadChats } = require("../db/db");

module.exports = class OutlookService extends Service {
  constructor(id, autoResponse, checkIfAllAuthed) {
    console.log("creating outlook service");
    super(id, "outlook", autoResponse, checkIfAllAuthed);
  }

  unReadLoop() {
    console.log("unread loop start", this.name);

    this.unreadLoopRef = setInterval(async () => {
      let unreadChats;
      try {
        unreadChats = await webContents
          .fromId(this.webContentsId)
          .executeJavaScript("window.getUnreadChats()");
      } catch (error) {
        unreadChats = 0;
      }

      this.unreadCount = unreadChats;
      // set in db
      setUnreadChats(this.id, unreadChats);
    }, 1000);
  }

  authLoop() {
    console.log("auth loop start", this.name);

    this.authLoopRef = setInterval(async () => {
      let isAuth;
      try {
        isAuth = await webContents
          .fromId(this.webContentsId)
          .executeJavaScript("window.isAuth()");
      } catch (error) {
        isAuth = false;
      }

      this.setAuthed(isAuth);
    }, 1000);
  }

  messagesLoop() {}

  setDnd() {}

  setOnline() {}

  getMessages(startTime) {}

  sendMessage(channel, message) {}
};
