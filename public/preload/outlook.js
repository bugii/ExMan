const { ipcRenderer, remote } = require("electron");

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

window.getUnreadChats = () => {
  console.log("checking for unread emails");
};
