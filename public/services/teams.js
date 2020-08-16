const { webContents } = require("electron");
const axios = require("axios");

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

const getMessages = (webContentsId, timestamp) => {};

const sendMessage = (webContentsId, channel, message) => {};

module.exports = {
  setDnd,
  setOnline,
  getMessages,
  sendMessage,
};
