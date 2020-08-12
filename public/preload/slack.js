const { remote } = require("electron");
console.log("in preload");

console.log(remote.session.defaultSession);
window.defaultSession = remote.session.defaultSession;
console.log(localStorage);

function getToken() {
  var security_objects = JSON.parse(localStorage.getItem("localConfig_v2"))[
    "teams"
  ];
  // As of now we just support 1 workspace for slack, so just taking the first item is fine
  var token = security_objects[Object.keys(security_objects)[0]].token;
  console.log(token);
  return token;
}

window.getToken = getToken;

class newNotification extends window.Notification {
  constructor(title, opt) {
    console.log("notification");
    console.log(title, opt);
    super(title, opt);
  }
  static permission = "granted";
}

window.Notification = newNotification;
