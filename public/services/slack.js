const { session, webContents } = require("electron");
const axios = require("axios");
const { getDb } = require("../db/db");

const setDnd = async () => {
  // get webContentsId for slack
  const db = getDb();
  const webContentsId = db.get("services").find({ name: "slack" }).value()
    .webContentsId;
  console.log("slack webcontents", webContentsId);
  // execute getToken funtion in the slack renderer to get token from localStorage
  const token = await webContents
    .fromId(webContentsId)
    .executeJavaScript("window.getToken()");

  // Get cookie
  const cookies = await session.defaultSession.cookies.get({
    url: "https://slack.com",
  });

  let stringCookie = "";

  cookies.forEach((cookie) => {
    if (cookie.name == "d") {
      stringCookie = `${cookie.name}=${cookie.value};`;
    }
  });

  // Call Do not Disturb on slack API with token and cookie
  await axios.get("https://slack.com/api/dnd.setSnooze", {
    params: {
      token,
      num_minutes: 5,
    },
    headers: {
      Cookie: stringCookie,
    },
  });
};

const getMessages = () => {};

const sendMessage = (token) => {
  session.defaultSession.cookies
    .get({ url: "https://slack.com" })
    .then(async (cookies) => {
      let stringCookie = "";

      cookies.forEach((cookie) => {
        if (cookie.name == "d") {
          stringCookie = `${cookie.name}=${cookie.value};`;
        }
      });

      console.log(stringCookie);

      var data = JSON.stringify({
        text: "POST from Electron Main process",
        channel: "D015HNN3JF9",
      });

      var config = {
        method: "post",
        url: "https://slack.com/api/chat.postMessage",
        headers: {
          Cookie: stringCookie,
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
    });
};

module.exports = {
  setDnd,
  getMessages,
  sendMessage,
};
