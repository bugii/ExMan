const { webContents } = require("electron");
const axios = require("axios");
const { getDb } = require("../db/db");

let res;
let autoReplied;

const isReplied = (Replied, channel) => {
  Replied.forEach((reply) => {
    if (reply.channel === channel) {
      console.log("true");
      return true;
    }
  });
  console.log("false");
  return false;
};

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
      console.log(syncToken);
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
      //console.log(syncToken);
      // update syncToken to db for next request
      getDb()
        .get("currentFocusSession")
        .get("services")
        .find({ webContentsId })
        .assign({ syncToken })
        .write();

      //console.log(syncToken);
      //console.log(tokens[1]);

      syncTokenLoop(webContentsId, new_res, tokens[1], message);
    } catch (e) {
      console.log(e);
    }
  }
};

const syncTokenLoop = async (webContentsId, res, skypetoken, message) => {
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

    autoReplied = getDb()
      .get("currentFocusSession")
      .get("services")
      .find({ webContentsId })
      .get("autoReplied")
      .value();

    if (username !== "") {
      // store messages in local db
      getDb()
        .get("currentFocusSession")
        .get("services")
        .find({ webContentsId })
        .get("messages")
        .push({ title: username, body: content, timestamp })
        .write();

      if (
        single_channel.includes("@unq.gbl.spaces") &&
        !isReplied(autoReplied, single_channel)
      ) {
        //do an auto-reply
        sendMessage(single_channel, message, skypetoken);

        // store auto-replied single_channel in db
        getDb()
          .get("currentFocusSession")
          .get("services")
          .find({ webContentsId })
          .get("autoReplied")
          .push({ channel: single_channel })
          .write();
      }
    }
  });
};

const sendMessage = async (channel, message, skypetoken) => {
  console.log(channel);
  const url = `https://emea.ng.msg.teams.microsoft.com/v1/users/ME/conversations/${channel}/messages`;
  console.log(url);
  try {
    await axios.post(
      url,
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

const getUnreadChats = async (webContentsId) => {
  const unreadChats = await webContents
    .fromId(webContentsId)
    .executeJavaScript("window.getUnreadChats()");
  return unreadChats;
};

module.exports = {
  setDnd,
  setOnline,
  getMessages,
  syncTokenLoop,
  getUnreadChats,
};
