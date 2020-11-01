const { BrowserWindow } = require("electron");
const axios = require("axios");
const { getTokens, storeTokens } = require("../db/db");
const qs = require("querystring");
const { PORT: port } = require("../db/memoryDb");

let authWindow;

const outlookAuthRequest = () => {
  console.log("auth request");

  authWindow = new BrowserWindow();
  authWindow.loadURL(
    "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=164e0e9e-6497-4810-8e72-a6ffd8b6ba62&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Foauth%2Fmicrosoft&response_mode=query&scope=offline_access%20https%3A%2F%2Fgraph.microsoft.com%2FCalendars.ReadWrite"
  );
};

const getOutlookAuthWindow = () => {
  return authWindow;
};

const refreshToken = async () => {
  const tokens = getTokens();

  if (tokens.microsoft) {
    const refresh_token = tokens.microsoft.refresh_token;

    const data = qs.stringify({
      client_id: "164e0e9e-6497-4810-8e72-a6ffd8b6ba62",
      scope: "offline_access https://graph.microsoft.com/Calendars.ReadWrite",
      redirect_uri: `http://localhost:${port}/oauth/microsoft`,
      grant_type: "refresh_token",
      refresh_token,
    });

    var config = {
      method: "post",
      url: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    try {
      const res = await axios(config);
      // store both tokens in db
      storeTokens("microsoft", {
        access_token: res.data.access_token,
        refresh_token: res.data.refresh_token,
        expires_in: res.data.expires_in,
      });

      console.log("renewed microsoft token");

      // schedule next token refreshing 5 minutes before expiry
      setTimeout(() => {
        refreshToken();
      }, (res.data.expires_in - 5 * 60) * 1000);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("cant refresh, not using outlook cal");
  }
};

module.exports = {
  outlookAuthRequest,
  getOutlookAuthWindow,
  refreshToken,
};
