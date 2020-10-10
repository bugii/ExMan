const { ipcRenderer, remote } = require("electron");

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
  // Taken from Franz
  let count = 0;
  const searchElement = document.querySelector(".im_dialogs_search_field");
  if (searchElement && searchElement.value === "") {
    const elements = document.querySelectorAll(
      ".im_dialog_badge:not(.ng-hide):not(.im_dialog_badge_muted)"
    );
    if (elements) {
      for (let i = 0; i < elements.length; i += 1) {
        if (elements[i].innerHTML !== 0) {
          count += 1;
        }
      }
    }
  }
  return count;
};

window.isAuth = () => {
  const el = document.querySelector(".icon-hamburger-wrap");

  if (el) {
    return true;
  }
  return false;
};
