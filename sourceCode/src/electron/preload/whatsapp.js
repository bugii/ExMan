const { ipcRenderer, remote } = require("electron");

console.log("in preload");

ipcRenderer.on("id", (e, id) => {
  console.log("id", id);
  window.serviceId = id;

  const interval = setInterval(() => {
    //   const ses = remote.session.fromPartition(`persist:${id}`);
    //   ses.clearStorageData({
    //     //Clears the specified storages in the session
    //     storages: [
    //       "appcache",
    //       "serviceworkers",
    //       "cachestorage",
    //       "websql",
    //       "indexdb",
    //     ],
    //   });
    const titleEl = document.querySelector(".window-title");
    if (titleEl && titleEl.innerHTML.includes("Google Chrome 49+")) {
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

window.getUnreadChats = () => {
  // Taken from Franz
  let count = 0;
  const elements = document.querySelectorAll(
    ".CxUIE, .unread, ._0LqQ, .m61XR .ZKn2B "
  );
  elements.forEach(() => {
    count += 1;
  });
  return count;
};

window.isAuth = () => {
  const el = document.querySelector("._1BjNO");

  if (el) {
    return true;
  }
  return false;
};
