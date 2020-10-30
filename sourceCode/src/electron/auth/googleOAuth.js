const { BrowserWindow } = require("electron");
const randomstring = require("randomstring");
const crypto = require("crypto");
const base64url = require("base64url");
let authWindow;

module.exports = {
  googleAuthRequest: () => {
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

    authWindow.loadURL(
      "https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Foauth%2Fgoogle&client_id=826944190379-4ollq01hentnf2ilduosida4g647a005.apps.googleusercontent.com",
      {
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:72.0) Gecko/20100101 Firefox/72.0",
      }
    );
  },

  getGoogleAuthWindow: () => {
    return authWindow;
  },
};
