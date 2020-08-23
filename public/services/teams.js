const { webContents } = require("electron");
const axios = require("axios");
const { getDb } = require("../db/db");

let res;

const setDnd = async (webContentsId) => {
  // execute getToken funtion in the slack renderer to get token from localStorage
  const tokens = await webContents
    .fromId(webContentsId)
    .executeJavaScript("window.getTokens()");

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
};

const setOnline = async (webContentsId) => {
  // execute getToken funtion in the slack renderer to get token from localStorage
  const tokens = await webContents
    .fromId(webContentsId)
    .executeJavaScript("window.getTokens()");

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
};

const getMessages = async (
  webContentsId,
  timestamp,
  syncTokenParam,
  message
) => {
  const tokens = await webContents
    .fromId(webContentsId)
    .executeJavaScript("window.getTokens()");

  // No synctoken provided => first request of focus session
  if (!syncTokenParam) {
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
      getDb()
        .get("currentFocusSession")
        .get("services")
        .find({ webContentsId })
        .assign({ syncToken })
        .write();
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
      //console.log("new conversations", new_res.data);
      // get new syncToken
      const syncToken = new_res.data["_metadata"]["syncState"];
      // update syncToken to db for next request
      getDb()
        .get("currentFocusSession")
        .get("services")
        .find({ webContentsId })
        .assign({ syncToken })
        .write();

      //console.log(syncToken);
      //console.log(tokens[1]);

      syncTokenLoop(webContentsId, syncToken, tokens[1], message);
    } catch (e) {
      console.log(e);
    }
  }
};

const syncTokenLoop = async (webContentsId, syncToken, skypetoken, message) => {
  const tokenUrl = String(syncToken);
  try {
    res = await axios.get(tokenUrl, {
      headers: {
        Authentication: `skypetoken=${skypetoken}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
  console.log("new conversations", res.data);
  res.data.conversations.forEach((channel) => {
    single_channel = channel.id;
    content = channel.lastMessage.content;
    username = channel.lastMessage.imdisplayname;
    timestamp = channel.lastMessage.originalarrivaltime;

    // display needed data in console
    console.log(single_channel);
    console.log(content);
    console.log(username);
    console.log(timestamp);

    // store messages in local db
    getDb()
      .get("currentFocusSession")
      .get("services")
      .find({ webContentsId })
      .get("messages")
      .push({ id: username, message_text: content, timestamp })
      .write();

    //do an auto-reply
    sendMessage(channel, message, skypetoken);
  });
};

const sendMessage = async (channel, message, skypetoken) => {
  try {
    await axios.post(
      `https://emea.ng.msg.teams.microsoft.com/v1/users/ME/conversations/${channel}/messages`,
      {
        content: message,
        messagetype: "Text",
      },
      {
        headers: {
          Authentication: `skypetoken=${skypetoken}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  setDnd,
  setOnline,
  getMessages,
  syncTokenLoop,
};
