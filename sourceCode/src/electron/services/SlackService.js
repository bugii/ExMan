const { webContents, session } = require("electron");
const {
  getDb,
  setUnreadChats,
  storeNotificationInArchive,
  updateWorkspaceName,
} = require("../db/db");
const axios = require("axios");
const Service = require("../services/Service");
const fillAutoresponseTemplate = require("../utils/fillAutoresponseTemplate");

module.exports = class SlackService extends Service {
  constructor(id, autoResponse, checkIfAllAuthed) {
    console.log("creating slack service");
    super(id, "slack", autoResponse, checkIfAllAuthed);
  }

  unReadLoop() {
    console.log("unread loop start", this.name);

    this.unreadLoopRef = setInterval(async () => {
      let unreadChats;
      let workspaceName;
      try {
        unreadChats = await webContents
          .fromId(this.webContentsId)
          .executeJavaScript("window.getUnreadChats()");
        workspaceName = await webContents
          .fromId(this.webContentsId)
          .executeJavaScript("window.getWorkspaceName()");
      } catch (error) {
        unreadChats = 0;
      }
      this.customName = workspaceName;

      this.unreadCount = unreadChats;
      // set in db
      setUnreadChats(this.id, unreadChats);
    }, 1000);
  }

  authLoop() {
    console.log("auth loop start", this.name);

    this.authLoopRef = setInterval(async () => {
      try {
        await this.getToken();
        this.setAuthed(true);
      } catch (e) {
        this.setAuthed(false);
      }
    }, 1000);
  }

  messagesLoop() {
    console.log("messages loop start", this.name);

    this.messagesLoopRef = setInterval(() => {
      const startTime = new Date().getTime() / 1000 - 10;
      this.getMessages(startTime);
    }, 10001);
  }

  async setDnd() {
    const token = await this.getToken();
    let cookies = await this.getCookies();

    // Call Do not Disturb on slack API with token and cookie
    await axios.get("https://slack.com/api/users.setPresence", {
      params: {
        token,
        presence: "away",
      },
      headers: {
        Cookie: cookies,
      },
    });
  }

  async setOnline() {
    const token = await this.getToken();
    let cookies = await this.getCookies();

    // End Do not Disturb session on slack API with token and cookie
    await axios.get("https://slack.com/api/users.setPresence", {
      params: {
        token,
        presence: "auto",
      },
      headers: {
        Cookie: cookies,
      },
    });
  }

  async getMessages(startTime) {
    const token = await this.getToken();
    let stringCookie = await this.getCookies();
    const userID = await this.getUserID();

    let username;

    // get all direct message channels as save it in an array
    const channels = [];

    await axios
      .get("https://slack.com/api/conversations.list", {
        params: {
          token,
          types: "im",
        },
        headers: {
          Cookie: stringCookie,
        },
      })
      .then((response) => {
        response.data.channels.forEach((element) => channels.push(element.id));
      });

    //retrieve the messages from the channels
    channels.forEach(async (channel) => {
      await axios
        .get("https://slack.com/api/conversations.history", {
          params: {
            token,
            channel,
            oldest: startTime,
          },
          headers: {
            Cookie: stringCookie,
          },
        })
        .then(async (response) => {
          response.data.messages.forEach(async (m) => {
            if (m.user !== userID) {
              const username = await this.getUsername(m.user);

              console.log("message: ", m.text);
              if (this.isInFocusSession()) {
                // In focus session
                // save message in database under currentFocusSession (required because notification is not sent in dnd, thus also not stored)

                const repliedList = getDb()
                  .get("currentFocusSession")
                  .get("services")
                  .find({ id: this.id })
                  .get("autoReplied")
                  .value();

                let alreadyReplied;

                repliedList.forEach((l) => {
                  if (l.channel != channel) {
                    alreadyReplied = false;
                  } else {
                    alreadyReplied = true;
                    return;
                  }
                });

                if (!alreadyReplied && this.autoResponse) {
                  // do an auto-reply by using the sendMessage function
                  this.sendMessage(channel);

                  // store auto-replied single_channel in db
                  getDb()
                    .get("currentFocusSession")
                    .get("services")
                    .find({ id: this.id })
                    .get("autoReplied")
                    .push({ channel })
                    .write();
                }
              }
            }
          });
        });
    });
  }

  async sendMessage(channel) {
    const token = await this.getToken();
    const cookies = await this.getCookies();

    var data = JSON.stringify({
      text: fillAutoresponseTemplate(),
      channel: channel,
    });

    console.log("Send auto-response to: ", channel);
    var config = {
      method: "post",
      url: "https://slack.com/api/chat.postMessage",
      headers: {
        Cookie: cookies,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async getToken() {
    const token = await webContents
      .fromId(this.webContentsId)
      .executeJavaScript("window.getToken()");
    return token;
  }

  async getCookies() {
    const cookies = await session
      .fromPartition(`persist:${this.id}`)
      .cookies.get({
        url: "https://slack.com",
      });

    let stringCookie = "";

    cookies.forEach((cookie) => {
      if (cookie.name == "d") {
        stringCookie = `${cookie.name}=${cookie.value};`;
      }
    });

    return stringCookie;
  }

  async getUserID() {
    const userId = await webContents
      .fromId(this.webContentsId)
      .executeJavaScript("window.getUserID()");

    return userId;
  }

  async getUsername(userId) {
    const token = await this.getToken();
    let stringCookie = await this.getCookies();
    let username;

    await axios
      .get("	https://slack.com/api/users.info", {
        params: {
          token,
          user: userId,
        },
        headers: {
          Cookie: stringCookie,
        },
      })
      .then((response) => {
        username = response.data.user.real_name;
      });

    return username;
  }
};
