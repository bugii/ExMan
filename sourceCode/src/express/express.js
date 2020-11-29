const express = require("express");
const axios = require("axios");
const qs = require("qs");
const randomstring = require("randomstring");
const crypto = require("crypto");
const base64url = require("base64url");

const { storeTokens } = require("../electron/db/db");
const {
  getOutlookAuthWindow,
  refreshToken: refreshTokenOutlook,
} = require("../electron/auth/outlookOAuth");
const {
  getGoogleAuthWindow,
  refreshToken: refreshTokenGoogle,
} = require("../electron/auth/googleOAuth");

const app = express();
const { storePORT, getPORT } = require("../electron/db/memoryDb");
const { calendarSuccessfullyAdded } = require("../electron/ipc/calendar");
const {
  getAndStoreCalendarEmail,
} = require("../electron/calendar/calendarNames");
app.use(express.json());

app.get("/oauth/google", async (req, res) => {
  const code = req.query.code;

  const data = qs.stringify({
    client_id:
      "826944190379-4ollq01hentnf2ilduosida4g647a005.apps.googleusercontent.com",
    scope: "https://www.googleapis.com/auth/calendar",
    code: code,
    redirect_uri: `http://localhost:${getPORT()}/oauth/google`,

    client_secret: "lyPQ5PC-xdNFM7cs828Tvqhd",
    grant_type: "authorization_code",
  });
  var config = {
    method: "post",
    url: "https://oauth2.googleapis.com/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };
  try {
    const res = await axios(config);
    // store both tokens in db
    storeTokens("google", {
      access_token: res.data.access_token,
      refresh_token: res.data.refresh_token,
      expires_in: res.data.expires_in,
    });
    getGoogleAuthWindow().destroy();
    // schedule next token refreshing 5 minutes before expiry
    setTimeout(() => {
      refreshTokenGoogle();
    }, (res.data.expires_in - 5 * 60) * 1000);
    const email = await getAndStoreCalendarEmail();
    calendarSuccessfullyAdded("google", email);
  } catch (error) {
    console.log(error);
  }
});

app.get("/oauth/microsoft", async (req, res) => {
  const code = req.query.code;

  const data = qs.stringify({
    client_id: "164e0e9e-6497-4810-8e72-a6ffd8b6ba62",
    scope: "offline_access https://graph.microsoft.com/Calendars.ReadWrite",
    code: code,
    redirect_uri: `http://localhost:${getPORT()}/oauth/microsoft`,
    grant_type: "authorization_code",
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
    getOutlookAuthWindow().destroy();
    // schedule next token refreshing 5 minutes before expiry
    setTimeout(() => {
      refreshTokenOutlook();
    }, (res.data.expires_in - 5 * 60) * 1000);
    const email = await getAndStoreCalendarEmail();
    calendarSuccessfullyAdded("outlook", email);
  } catch (error) {
    console.log(error);
  }
});

const server = app.listen(0, () => {
  const port = server.address().port;
  console.log(`Local webserver running on port: ${port}`);
  storePORT(port);
});
