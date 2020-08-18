const { session, webContents } = require("electron");
const axios = require("axios");

const setDnd = async (webContentsId, diffMins) => {
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
      num_minutes: diffMins,
    },
    headers: {
      Cookie: stringCookie,
    },
  });
};

const setOnline = async (webContentsId) => {
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
  const token = await webContents
    .fromId(webContentsId)
    .executeJavaScript("window.getToken()");

    // get userID from localStorage
    const userID = await webContents
    .fromId(webContentsId)
    .executeJavaScript("window.getUserID()");

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

  // get all direct message channels as save it in an array
  const channels = [];

  await axios.get("https://slack.com/api/conversations.list", {
    params: {
      token,
      types:'im',
    },
    headers: {
      Cookie: stringCookie,
    },
  }).then((response) =>{
    response.data.channels.forEach(element => channels.push(element.id));
    });


  //var seconds = (new Date().getTime() / 1000) - 10000;

  //retrieve the messages from the channels
  channels.forEach ( async (channel) => {
    await axios.get("https://slack.com/api/conversations.history", {
      params: {
        token,
        channel,
        oldest: startTime,
      },
      headers: {
        Cookie: stringCookie,
      },
    }).then(response =>{
      response.data.messages.forEach(m => {
        if (m.user !== userID){
          sendMessage(webContentsId, channel, messages)
        }
      })

    });
  })
};

const sendMessage = async (webContentsId, channel, message) => {
  // execute getToken funtion in the slack renderer to get token from localStorage
  const token = await webContents
    .fromId(webContentsId)
    .executeJavaScript("window.getToken()");

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
