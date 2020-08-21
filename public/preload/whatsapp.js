const { ipcRenderer, remote } = require("electron");

ipcRenderer.on("id", (e, id) => {
  console.log("id", id);
  window.serviceId = id;
});

console.log("in preload");

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

var ses = remote.session.defaultSession; //Gets the default session
ses.clearStorageData({
  //Clears the specified storages in the session
  storages: ["serviceworkers"],
});

const interval = setInterval(() => {
  const titleEl = document.querySelector(".window-title");
  if (titleEl && titleEl.innerHTML.includes("Google Chrome 49+")) {
    // reloading
    window.location.reload();
  } else clearInterval(interval);
}, 1000);
