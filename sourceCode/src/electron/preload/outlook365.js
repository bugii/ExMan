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
  // taken from ferdi

  let unreadMail = 0;

  const folders = document.querySelector('div[title="Folders"]');
  if (!folders) {
    return;
  }

  unreadMail = [...folders.parentNode.parentNode.children].reduce(
    (count, child) => {
      const unread = child.querySelector(".screenReaderOnly");
      return unread && unread.textContent === "unread"
        ? count + parseInt(unread.previousSibling.textContent, 10)
        : count;
    },
    0
  );
  return unreadMail;
};

window.isAuth = () => {
  return document.getElementById("app") ? true : false;
};
