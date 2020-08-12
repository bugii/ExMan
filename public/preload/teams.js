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
