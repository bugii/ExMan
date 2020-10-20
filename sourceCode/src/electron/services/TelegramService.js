const { webContents, session } = require("electron");

const Service = require("../services/Service");
const { setUnreadChats } = require("../db/db");

module.exports = class TelegramService extends Service {
  constructor(id, autoResponse, checkIfAllAuthed) {
    console.log("creating telegram service");
    super(id, "telegram", autoResponse, checkIfAllAuthed);
  }

  unReadLoop() {
    console.log("unread loop start", this.name);

    this.unreadLoopRef = setInterval(async () => {
      const unreadChats = await webContents
        .fromId(this.webContentsId)
        .executeJavaScript("window.getUnreadChats()");

      this.unreadCount = unreadChats;
      // set in db
      setUnreadChats(this.id, unreadChats);
    }, 1000);
  }

  authLoop() {
    console.log("auth loop start", this.name);

    this.authLoopRef = setInterval(async () => {
      const isAuth = await webContents
        .fromId(this.webContentsId)
        .executeJavaScript("window.isAuth()");

      this.setAuthed(isAuth);
    }, 1000);
  }

  messagesLoop() {}

  setDnd() {}

  setOnline() {}

  getMessages(startTime) {}

  sendMessage(channel, message) {}
};