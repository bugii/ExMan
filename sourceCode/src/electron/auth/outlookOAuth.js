const { BrowserWindow } = require("electron");

let authWindow;

module.exports = {
  outlookAuthRequest: () => {
    console.log("auth request");

    authWindow = new BrowserWindow();
    authWindow.loadURL(
      "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=164e0e9e-6497-4810-8e72-a6ffd8b6ba62&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Foauth%2Fmicrosoft&response_mode=query&scope=offline_access%20https%3A%2F%2Fgraph.microsoft.com%2FCalendars.ReadWrite"
    );
  },

  getOutlookAuthWindow: () => {
    return authWindow;
  },
};
