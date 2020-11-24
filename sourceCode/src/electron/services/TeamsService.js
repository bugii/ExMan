const { webContents } = require("electron");
const { getDb, storeNotificationInArchive } = require("../db/db");
const axios = require("axios");
const Service = require("../services/Service");
const { setUnreadChats, getTeamsCall } = require("../db/db");
const fillAutoresponseTemplate = require("../utils/fillAutoresponseTemplate");
const { setcallincoming } = require("../db/memoryDb");

module.exports = class TeamsService extends (
  Service
) {
  constructor(id, autoResponse, checkIfAllAuthed) {
    // clear session storage
    console.log("creating teams service");
    super(id, "teams", autoResponse, checkIfAllAuthed);
    this.syncToken = null;
    this.username = null;
    this.checkForCall = null;
    this.regionID = null;
  }

  unReadLoop() {
    console.log("unread loop start", this.name);

    this.unreadLoopRef = setInterval(async () => {
      let unreadChats;
      let workspaceName;
      let teamscall = getTeamsCall();
      //console.log("test:", teamscall);
      try {
        unreadChats = await webContents
          .fromId(this.webContentsId)
          .executeJavaScript("window.getUnreadChats()");
        workspaceName = await webContents
          .fromId(this.webContentsId)
          .executeJavaScript("window.getWorkspaceName()");
        // function check for call from preload
        if (teamscall) {
          this.checkForCall = await webContents
            .fromId(this.webContentsId)
            .executeJavaScript(`window.checkForCall(${this.checkForCall})`);
        }
      } catch (error) {
        unreadChats = 0;
      }

      this.customName = workspaceName;
      //console.log("display: ", this.customName);
      this.unreadCount = unreadChats;
      // set in db
      setUnreadChats(this.id, unreadChats);
    }, 1000);
  }

  authLoop() {
    console.log("auth loop start", this.name);

    this.authLoopRef = setInterval(async () => {
      try {
        //if (this.username === null) {
        //  this.username = await webContents
        //    .fromId(this.webContentsId)
        //    .executeJavaScript("window.getUsername()");
        //  console.log("teams username", this.username);
        //}
        const tokens = await this.getToken();
        const regionID = await this.getRegionName();
        const teamsResponse = {
          method: "get",
          url: `https://${regionID}.ng.msg.teams.microsoft.com/v1/users/ME/properties`,
          headers: {
            Authentication: `skypetoken=${tokens[1]}`,
          },
        };

        if (this.username === null) {
          const response = await axios(teamsResponse);

          const teamsObject = JSON.parse(response.data["userDetails"]);
          this.username = teamsObject["name"];
          console.log("teams username", this.username);
        }

        this.setAuthed(true);
      } catch (e) {
        console.log(e);
        this.username = null;
        this.setAuthed(false);
      }
    }, 1000);
  }

  messagesLoop() {
    console.log("messages loop start", this.name);

    this.messagesLoopRef = setInterval(() => {
      this.getMessages();
    }, 10000);
  }

  async setDnd() {
    const tokens = await this.getToken();

    try {
      await axios.put(
        "https://presence.teams.microsoft.com/v1/me/forceavailability/",
        {
          availability: "Busy",
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

  async getMessages() {
    const tokens = await this.getToken();
    const regionID = await this.getRegionName();

    // No synctoken provided => first request of focus session
    if (!this.syncToken) {
      console.log("first message loop, teams");
      try {
        const res = await axios.get(
          `https://${regionID}.ng.msg.teams.microsoft.com/v1/users/ME/conversations/`,
          {
            headers: {
              Authentication: `skypetoken=${tokens[1]}`,
              "Content-Type": "application/json",
            },
          }
        );
        this.syncToken = res.data["_metadata"]["syncState"];

        const new_res = await axios.get(this.syncToken, {
          headers: {
            Authentication: `skypetoken=${tokens[1]}`,
            "Content-Type": "application/json",
          },
        });

        this.syncToken = new_res.data["_metadata"]["syncState"];

        console.log("syncToken", this.syncToken);
      } catch (error) {
        console.log(error);
      }
    } else {
      //console.log("message loop with sync token", this.syncToken);
      try {
        const new_res = await axios.get(this.syncToken, {
          headers: {
            Authentication: `skypetoken=${tokens[1]}`,
            "Content-Type": "application/json",
          },
        });

        // get new syncToken
        this.syncToken = new_res.data["_metadata"]["syncState"];

        new_res.data.conversations.forEach(async (channel) => {
          //console.log(channel);
          const single_channel = channel.id;
          const content = channel.lastMessage.content;
          const username = channel.lastMessage.imdisplayname;
          const timestamp = new Date(
            channel.lastMessage.originalarrivaltime
          ).getTime();

          //console.log(channel);

          if (username !== "" && username !== this.username) {
            console.log("message:", content);
            if (this.isInFocusSession()) {
              // Currently in focus session

              const autoReplied = getDb()
                .get("currentFocusSession")
                .get("services")
                .find({ id: this.id })
                .get("autoReplied")
                .value();

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
          }
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  async sendMessage(channel) {
    const tokens = await this.getToken();
    const regionID = await this.getRegionName();

    console.log("Send auto-response to:", channel);
    const url = `https://${regionID}.ng.msg.teams.microsoft.com/v1/users/ME/conversations/${channel}/messages`;
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
    // execute getToken function in the teams renderer to get token from localStorage
    let tokens;
    try {
      tokens = await webContents
        .fromId(this.webContentsId)
        .executeJavaScript("window.getTokens()");
    } catch (error) {
      tokens = [];
    }

    return tokens;
  }

  async getRegionName() {
    // execute getRegionName function in the teams renderer to get regionID from localStorage
    let regionName;
    try {
      regionName = await webContents
        .fromId(this.webContentsId)
        .executeJavaScript("window.getRegionName()");
    } catch (error) {
      regionName = [];
    }

    return regionName;
  }

  isReplied(Replied, channel) {
    for (let index = 0; index < Replied.length; index++) {
      const reply = Replied[index];
      if (reply.channel === channel) {
        return true;
      }

      return false;
    }
  }
};
