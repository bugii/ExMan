const { remote, desktopCapturer } = require("electron");
console.log("in preload");

console.log(remote.session.defaultSession);
window.defaultSession = remote.session.defaultSession;
console.log(localStorage);

var ses = remote.session.defaultSession; //Gets the default session
// ses.flushStorageData(); //Writes any unwritten DOMStorage data to disk
ses.clearStorageData({
  //Clears the specified storages in the session
  storages: ["appcache", "serviceworkers", "cachestorage", "websql", "indexdb"],
});

function getTokens() {
  const presenceToken = localStorage.getItem(
    "adal.access.token.keyhttps://presence.teams.microsoft.com/"
  );
  return [presenceToken];
}

window.getTokens = getTokens;

// currently required for teams, unsure why
// taken from https://github.com/meetfranz/Microsoft-Teams/blob/master/webview.js
// window.electronSafeIpc = {
//   send: () => null,
//   on: () => null,
// };
// window.desktop = undefined;

class newNotification extends window.Notification {
  constructor(title, opt) {
    console.log("notification");
    console.log(title, opt);
    super(title, opt);
  }
  static permission = "granted";
}

window.Notification = newNotification;

// Polyfill taken from https://github.com/electron/electron/issues/16513
window.navigator.mediaDevices.getDisplayMedia = () => {
  return new Promise(async (resolve, reject) => {
    console.log("getting display media");
    try {
      const sources = await desktopCapturer.getSources({
        types: ["screen", "window"],
      });

      const selectionElem = document.createElement("div");
      selectionElem.classList = "desktop-capturer-selection";
      selectionElem.innerHTML = `
        <div class="desktop-capturer-selection__scroller">
          <ul class="desktop-capturer-selection__list">
            ${sources
              .map(
                ({ id, name, thumbnail, display_id, appIcon }) => `
              <li class="desktop-capturer-selection__item">
                <button class="desktop-capturer-selection__btn" data-id="${id}" title="${name}">
                  <img class="desktop-capturer-selection__thumbnail" src="${thumbnail.toDataURL()}" />
                  <span class="desktop-capturer-selection__name">${name}</span>
                </button>
              </li>
            `
              )
              .join("")}
          </ul>
        </div>
      `;
      document.body.appendChild(selectionElem);

      document
        .querySelectorAll(".desktop-capturer-selection__btn")
        .forEach((button) => {
          button.addEventListener("click", async () => {
            try {
              const id = button.getAttribute("data-id");
              const source = sources.find((source) => source.id === id);
              if (!source) {
                throw new Error(`Source with id ${id} does not exist`);
              }

              const stream = await window.navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                  mandatory: {
                    chromeMediaSource: "desktop",
                    chromeMediaSourceId: source.id,
                  },
                },
              });
              resolve(stream);

              selectionElem.remove();
            } catch (err) {
              console.error("Error selecting desktop capture source:", err);
              reject(err);
            }
          });
        });
    } catch (err) {
      console.error("Error displaying desktop capture sources:", err);
      reject(err);
    }
  });
};
