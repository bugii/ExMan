const { ipcRenderer } = require("electron");

console.log("in preload");

ipcRenderer.on("id", (e, id) => {
  console.log("id", id);
  window.serviceId = id;
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

window.getUnreadChats = () => {
  let count = 0;
  try {
    count = parseInt(
      document.querySelector("div[title*='Inbox']  > span > span").firstChild
        .innerHTML
    );
  } catch (e) {}
  return count;
};

window.isAuth = () => {
  return document.getElementById("app") ? true : false;
};
