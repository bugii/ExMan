const { remote, desktopCapturer, ipcRenderer } = require("electron");

console.log("in preload");

ipcRenderer.on("id", (e, id) => {
  console.log("id", id);
  window.serviceId = id;
});

console.log(remote.session.defaultSession);
window.defaultSession = remote.session.defaultSession;
console.log(localStorage);

class newNotification extends window.Notification {
  constructor(title, opt) {
    // By not calling super(), the notification cannot be sent with the HTML Notification API
    // rather, forward to main process, check for a focus session and use electrons Notifiation module to send notification
    console.log("notification", window.serviceId, title, opt);
    ipcRenderer.send("notification", {
      id: window.serviceId,
      title,
      body: opt.body,
    });
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

window.getUnreadChats = () => {
  // Taken from Franz
  let count = 0;
  const container = document.querySelector(
    '[role="tablist"] > [title="Chats"] > div'
  );
  if (container) {
    const children = container.children;

    if (children.length === 3) {
      const elementContainer = children[children.length - 1];
      if (elementContainer) {
        const element = elementContainer.querySelector(
          "[data-text-as-pseudo-element]"
        );
        count = parseInt(element.dataset.textAsPseudoElement, 10);
      }
    }
  }
  return count;
};
