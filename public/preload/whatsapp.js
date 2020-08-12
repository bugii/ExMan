const { remote } = require("electron");
console.log("in preload");

console.log(remote.session.defaultSession);
window.defaultSession = remote.session.defaultSession;
console.log(localStorage);

class newNotification extends window.Notification {
  constructor(title, opt) {
    console.log("notification");
    console.log(title, opt);
    super(title, opt);
  }
  static permission = "granted";
}

window.Notification = newNotification;

var ses = remote.session.defaultSession; //Gets the default session
// ses.flushStorageData(); //Writes any unwritten DOMStorage data to disk
ses.clearStorageData({
  //Clears the specified storages in the session
  storages: ["appcache", "serviceworkers", "cachestorage", "websql", "indexdb"],
});
// window.navigator.serviceWorker.getRegistrations().then((registrations) => {
//   for (let registration of registrations) {
//     registration.unregister(); //Unregisters all the service workers
//   }
// });

const id = setInterval(() => {
  const titleEl = document.querySelector(".window-title");
  if (titleEl && titleEl.innerHTML.includes("Google Chrome 49+")) {
    // reloading
    window.location.reload();
  } else clearInterval(id);
}, 1000);
