const { webContents } = require("electron");
const { getDb, storeNotificationInArchive } = require("../db/db");
const axios = require("axios");
const Service = require("../services/Service");
const { setUnreadChats } = require("../db/db");
const fillAutoresponseTemplate = require("../utils/fillAutoresponseTemplate");

module.exports = class TeamsService extends Service {
  constructor(id, autoResponse, checkIfAllAuthed) {
    // clear session storage
    console.log("creating teams service");
    super(id, "teams", autoResponse, checkIfAllAuthed);
    this.syncToken = null;
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
      this.getMessages(this.syncToken);
    }, 10000);
  }

  async setDnd() {
    const tokens = await this.getToken();

    try {
      await axios.put(
        "https://presence.teams.microsoft.com/v1/me/forceavailability/",
        {
          availability: "DoNotDisturb",
        },
        {
          headers: {
            Authorization: `Bearer ${tokens[0]}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async setOnline() {
    const tokens = await this.getToken();

    try {
      await axios.put(
        "https://presence.teams.microsoft.com/v1/me/forceavailability/",
        {
          availability: "Available",
        },
        {
          headers: {
            Authorization: `Bearer ${tokens[0]}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async getMessages(syncTokenParam) {
    const tokens = await this.getToken();

    // No synctoken provided => first request of focus session
    if (!syncTokenParam) {
      console.log("first message loop, teams");
      try {
        const res = await axios.get(
          "https://emea.ng.msg.teams.microsoft.com/v1/users/ME/conversations/",
          {
            headers: {
              Authentication: `skypetoken=${tokens[1]}`,
              "Content-Type": "application/json",
            },
          }
        );

        const syncToken = res.data["_metadata"]["syncState"];

        // save syncToken to db for next request
        this.syncToken = syncToken;
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        // Synctoken provided => not first request of focus session: use token to get delta of conversations
        const new_res = await axios.get(syncTokenParam, {
          headers: {
            Authentication: `skypetoken=${tokens[1]}`,
            "Content-Type": "application/json",
          },
        });
        // get new syncToken
        const syncToken = new_res.data["_metadata"]["syncState"];
        // update syncToken to db for next request
        this.syncToken = syncToken;

        new_res.data.conversations.forEach((channel) => {
          const single_channel = channel.id;
          const content = channel.lastMessage.content;
          const username = channel.lastMessage.imdisplayname;
          const timestamp = new Date(
            channel.lastMessage.originalarrivaltime
          ).getTime();

          // display needed data in console
          console.log(single_channel);
          console.log(content);
          console.log(username);
          console.log(timestamp);

          if (username !== "") {
            if (this.isInFocusSession()) {
              // Currently in focus session

              const autoReplied = getDb()
                .get("currentFocusSession")
                .get("services")
                .find({ id: this.id })
                .get("autoReplied")
                .value();

              const focusStart = getDb()
                .get("currentFocusSession")
                .get("startTime")
                .value();

              const focusDate = new Date(focusStart);
              const timestampDate = new Date(timestamp);

              if (timestampDate > focusDate) {
                // safety measure to not store any old messages (luthi encountered this for some reason)
                // store messages in local db
                getDb()
                  .get("currentFocusSession")
                  .get("services")
                  .find({ id: this.id })
                  .get("messages")
                  .push({
                    title: username,
                    body: content,
                    timestamp: timestampDate.getTime(),
                  })
                  .write();

                if (
                  single_channel.includes("@unq.gbl.spaces") &&
                  !this.isReplied(autoReplied, single_channel) &&
                  this.autoResponse
                ) {
                  //do an auto-reply
                  this.sendMessage(single_channel);

                  // store auto-replied single_channel in db
                  getDb()
                    .get("currentFocusSession")
                    .get("services")
                    .find({ id: this.id })
                    .get("autoReplied")
                    .push({ channel: single_channel })
                    .write();
                }
              }
            } else {
              // not in focus session, still store to archive
              storeNotificationInArchive(this.id, username);
            }
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async sendMessage(channel) {
    const tokens = await this.getToken();
    console.log("skype token used", tokens[1]);

    console.log(channel);
    const url = `https://emea.ng.msg.teams.microsoft.com/v1/users/ME/conversations/${channel}/messages`;
    console.log(url);
    try {
      await axios.post(
        url,
        {
          content: fillAutoresponseTemplate(),
          messagetype: "Text",
        },
        {
          headers: {
            Authentication: `skypetoken=${tokens[1]}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async getToken() {
    // execute getToken funtion in the slack renderer to get token from localStorage
    const tokens = await webContents
      .fromId(this.webContentsId)
      .executeJavaScript("window.getTokens()");

    return tokens;
  }

  isReplied(Replied, channel) {
    for (let index = 0; index < Replied.length; index++) {
      const reply = Replied[index];
      if (reply.channel === channel) {
        console.log("true");
        return true;
      }
      console.log("false");
      return false;
    }
  }

  handleNotification(isFoucs, title, body) {
    console.log(this.name, "notification received, doing nothing with it");
    // don't do anything
    return;
  }
};
