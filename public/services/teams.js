const { webContents } = require("electron");
const axios = require("axios");
const { getDb } = require("../db/db");

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

const getMessages = async (webContentsId, timestamp, syncTokenParam) => {
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
      console.log("new conversations", new_res.data);
      // get new syncToken
      const syncToken = new_res.data["_metadata"]["syncState"];
      // update syncToken to db for next request
      getDb()
        .get("currentFocusSession")
        .get("services")
        .find({ webContentsId })
        .assign({ syncToken })
        .write();
    } catch (e) {
      console.log(e);
    }
  }
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
          Authorization: `Bearer ${skypetoken}`,
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
  sendMessage,
};
