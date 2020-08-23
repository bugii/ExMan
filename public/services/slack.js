const { session, webContents } = require("electron");
const axios = require("axios");
const { getDb } = require("../db/db");

const getToken = async (webContentsId) => {
  // execute getToken funtion in the slack renderer to get token from localStorage
  const token = await webContents
    .fromId(webContentsId)
    .executeJavaScript("window.getToken()");
  return token;
};

const getCookies = async (webContentsId) => {
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

  return stringCookie;
};

const getUsername = async (webContentsId, userID) => {
  const token = await getToken(webContentsId);
  let stringCookie = await getCookies(webContentsId);
  let username;

  await axios
    .get("	https://slack.com/api/users.info", {
      params: {
        token,
        user: userID,
      },
      headers: {
        Cookie: stringCookie,
      },
    })
    .then((response) => {
      username = response.data.user.real_name;
    });

  return username;
};

const setDnd = async (webContentsId, diffMins) => {
  const token = await getToken(webContentsId);
  let stringCookie = await getCookies(webContentsId);

  // Call Do not Disturb on slack API with token and cookie
  await axios.get("https://slack.com/api/dnd.setSnooze", {
    params: {
      token,
      num_minutes: diffMins,
    },
    headers: {
      Cookie: stringCookie,
    },
  });
};

const setOnline = async (webContentsId) => {
  const token = await getToken(webContentsId);
  let stringCookie = await getCookies(webContentsId);

  // End Do not Disturb session on slack API with token and cookie
  await axios.get("https://slack.com/api/dnd.endSnooze", {
    params: {
      token,
    },
    headers: {
      Cookie: stringCookie,
    },
  });
};

const getMessages = async (webContentsId, startTime, messages) => {
  const token = await getToken(webContentsId);
  let stringCookie = await getCookies(webContentsId);
  let username;

  // get userID from localStorage
  const userID = await webContents
    .fromId(webContentsId)
    .executeJavaScript("window.getUserID()");

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
            username = await getUsername(webContentsId, m.user);

            // save message in database
            getDb()
              .get("currentFocusSession")
              .get("services")
              .find({ webContentsId })
              .get("messages")
              .push({ id: username, message_text: m.text, timestamp: m.ts })
              .write();
            // do an auto-reply by using the sendMessage function
            sendMessage(webContentsId, channel, messages);
          }
        });
      });
  });
};

const sendMessage = async (webContentsId, channel, message) => {
  // execute getToken funtion in the slack renderer to get token from localStorage
  const token = await getToken(webContentsId);

  session.defaultSession.cookies
    .get({ url: "https://slack.com" })
    .then(async (cookies) => {
      let stringCookie = "";

      cookies.forEach((cookie) => {
        if (cookie.name == "d") {
          stringCookie = `${cookie.name}=${cookie.value};`;
        }
      });

      var data = JSON.stringify({
        text: message,
        channel: channel,
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
  setOnline,
  getMessages,
  sendMessage,
};
