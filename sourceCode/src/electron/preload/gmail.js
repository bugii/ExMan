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
  // Taken from Franz
  let count = 0;

  if (document.getElementsByClassName("J-Ke n0").length > 0) {
    if (
      document
        .getElementsByClassName("J-Ke n0")[0]
        .getAttribute("aria-label") != null
    ) {
      count = parseInt(
        document
          .getElementsByClassName("J-Ke n0")[0]
          .getAttribute("aria-label")
          .replace(/[^0-9.]/g, ""),
        10
      );
    }
  }

  // Just incase we don't end up with a number, set it back to zero (parseInt can return NaN)
  count = parseInt(count, 10);
  if (isNaN(count)) {
    count = 0;
  }
  return count;
};

window.isAuth = () => {
  return document.getElementById("loading").style.display === "none"
    ? true
    : false;
};
