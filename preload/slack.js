const clickStatusIcon = async () => {
  const menu = document.querySelector(".p-ia__sidebar_header__button");
  menu.click();
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
