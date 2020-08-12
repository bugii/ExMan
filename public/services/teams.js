const { webContents } = require("electron");
const axios = require("axios");
const { getDb } = require("../db/db");

const setDnd = async () => {
  // get webContentsId for teams
  const db = getDb();
  const webContentsId = db.get("services").find({ name: "teams" }).value()
    .webContentsId;
  console.log("teams webcontents", webContentsId);
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

const getMessages = () => {};

const sendMessage = () => {};

module.exports = {
  setDnd,
  getMessages,
  sendMessage,
};
