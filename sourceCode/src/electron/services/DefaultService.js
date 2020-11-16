const { webContents, session } = require("electron");

const Service = require("../services/Service");
const { setUnreadChats } = require("../db/db");

module.exports = class DefaultService extends Service {
  constructor(id, name, url, autoResponse, checkIfAllAuthed) {
    console.log(`creating ${name} service`);
    super(id, name, autoResponse, checkIfAllAuthed);
    this.url = url;
    this.isOther = true;
  }

  unReadLoop() {}

  authLoop() {
    this.setAuthed(true);
  }

  messagesLoop() {}

  setDnd() {}

  setOnline() {}

  getMessages(startTime) {}

  sendMessage(channel, message) {}
};
