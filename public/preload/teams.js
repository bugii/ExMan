const { remote } = require("electron");
console.log("in preload");

console.log(remote.session.defaultSession);
window.defaultSession = remote.session.defaultSession;
console.log(localStorage);

function getTokens() {
  const presenceToken = localStorage.getItem(
    "adal.access.token.keyhttps://presence.teams.microsoft.com/"
  );
  return [presenceToken];
}

window.getTokens = getTokens;

// currently required for teams, unsure why
// taken from https://github.com/meetfranz/Microsoft-Teams/blob/master/webview.js
window.electronSafeIpc = {
  send: () => null,
  on: () => null,
};
window.desktop = undefined;

class newNotification extends window.Notification {
  constructor(title, opt) {
    console.log("notification");
    console.log(title, opt);
    super(title, opt);
  }
  static permission = "granted";
}

window.Notification = newNotification;

navigator.getUserMedia(
  { video: true, audio: true },
  (localMediaStream) => {
    var video = document.querySelector("video");
    video.src = window.URL.createObjectURL(localMediaStream);
    video.onloadedmetadata = (e) => {
      // Ready to go. Do some stuff.
    };
  },
  errorCallback
);
