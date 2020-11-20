const { ipcRenderer } = require("electron");

console.log("in preload");

ipcRenderer.on("id", (e, id) => {
  console.log("id", id);
  window.serviceId = id;

  const interval = setInterval(() => {
    const titleEl = document.querySelector(".window-title");
    if (titleEl && titleEl.innerHTML.includes("Google Chrome 60+")) {
      // reloading
      window.location.reload();
    } else clearInterval(interval);
  }, 1000);
});

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

const isMutedIcon = (element) =>
  element.parentElement.parentElement.querySelectorAll('*[data-icon="muted"]')
    .length !== 0;

const isPinnedIcon = (element) => element.classList.contains("_1EFSv");

window.getUnreadChats = () => {
  // Taken from Franz
  const elements = document.querySelectorAll(
    ".CxUIE, .unread, ._0LqQ, .m61XR .ZKn2B "
  );

  let count = 0;

  for (let i = 0; i < elements.length; i += 1) {
    try {
      // originalLog(isMutedIcon(elements[i]), isPinnedIcon(elements[i]));
      if (!isMutedIcon(elements[i]) && !isPinnedIcon(elements[i])) {
        count += 1;
      }
    } catch (err) {
      console.log(err);
    }
  }
  return count;
};

window.isAuth = () => {
  const el = document.querySelector("._3t3gU");

  if (el) {
    return true;
  }
  return false;
};
