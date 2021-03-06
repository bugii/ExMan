const { BrowserWindow } = require("electron");
const randomstring = require("randomstring");
const crypto = require("crypto");
const base64url = require("base64url");
const { getTokens, storeTokens } = require("../db/db");
const qs = require("querystring");
const axios = require("axios");
const { getPORT } = require("../db/memoryDb");
const { getAndStoreCalendarEmail } = require("../calendar/calendarNames");

let authWindow;

const googleAuthRequest = () => {
  console.log("auth request");

  authWindow = new BrowserWindow();

  // const code_verifier = randomstring.generate(128);
  // console.log(code_verifier);

  // const base64Digest = crypto
  //   .createHash("sha256")
  //   .update(code_verifier)
  //   .digest("base64");

  // const code_challenge = base64url.fromBase64(base64Digest);
  // console.log(code_challenge);

  const url = qs.stringify({
    scope: "https://www.googleapis.com/auth/calendar",
    response_type: "code",
    redirect_uri: `http://localhost:${getPORT()}/oauth/google`,
    client_id:
      "826944190379-4ollq01hentnf2ilduosida4g647a005.apps.googleusercontent.com",
  });

  authWindow.loadURL("https://accounts.google.com/o/oauth2/v2/auth?" + url, {
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:72.0) Gecko/20100101 Firefox/72.0",
  });
};

const getGoogleAuthWindow = () => {
  return authWindow;
};

const refreshToken = async () => {
  const tokens = getTokens();
  if (tokens.google) {
    const refresh_token = tokens.google.refresh_token;

    const data = qs.stringify({
      client_id:
        "826944190379-4ollq01hentnf2ilduosida4g647a005.apps.googleusercontent.com",
      client_secret: "lyPQ5PC-xdNFM7cs828Tvqhd",
      grant_type: "refresh_token",
      refresh_token,
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
        refresh_token,
        expires_in: res.data.expires_in,
      });
      await getAndStoreCalendarEmail();
      console.log("renewed google token");

      // schedule next token refreshing 5 minutes before expiry
      setTimeout(() => {
        refreshToken();
      }, (res.data.expires_in - 5 * 60) * 1000);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("cant refresh, not using google cal");
  }
};

module.exports = {
  googleAuthRequest,
  getGoogleAuthWindow,
  refreshToken,
};
