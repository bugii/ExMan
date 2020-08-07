const clickStatusIcon = async () => {
  const menu = document.querySelector("[data-tid='personDropdown']");
  menu.click();
};

window.setDoNotDisturb = () => {
  clickStatusIcon();
  // since it is an angular app and the menu is created through javascript, we have to wait some time to make sure that the
  // menu was completely rendered to the screen
  setTimeout(() => {
    var dnd = document.querySelector(
      "[data-tid='skypeStatusDropdownMenuItem-donotdisturb']"
    );
    dnd.click();
  }, 1000);
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
