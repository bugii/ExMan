const express = require("express");
const axios = require("axios");
const qs = require("qs");
const randomstring = require("randomstring");
const crypto = require("crypto");
const base64url = require("base64url");

const { storeTokens } = require("../electron/db/db");
const { getOutlookAuthWindow } = require("../electron/auth/outlookOAuth");
const { getGoogleAuthWindow } = require("../electron/auth/googleOAuth");

const app = express();
const port = 4000;

app.use(express.json());

app.get("/oauth/google", async (req, res) => {
  console.log(req.query.code);
  const code = req.query.code;

  const data = qs.stringify({
    client_id:
      "826944190379-4ollq01hentnf2ilduosida4g647a005.apps.googleusercontent.com",
    scope: "https://www.googleapis.com/auth/calendar",
    code: code,
    redirect_uri: `http://localhost:${port}/oauth/google`,
    // code_challenge,
    // code_challenge_method: "S256",
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
    console.log(res);
    storeTokens("google", {
      access_token: res.data.access_token,
      refresh_token: res.data.refresh_token,
    });
    getGoogleAuthWindow().destroy();
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
    redirect_uri: `http://localhost:${port}/oauth/microsoft`,
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
    });
    getOutlookAuthWindow().destroy();
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Local webserver running on port: ${port}`);
});
