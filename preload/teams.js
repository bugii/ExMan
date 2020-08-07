const clickStatusIcon = async () => {
  const menu = document.querySelector("[data-tid='personDropdown']");
  menu.click();
};

// send message for teams
const teamsMessage = (message) => {
  var a = document.getElementById('cke_1_contents');
  var b = a.children[0];
  var c = b.children;
  c[0].innerText = message;
  document.getElementById("send-message-button").click();
};

const getUnreadMessage = async () => {
  document.getElementById("app-bar-86fcd49b-61a2-4701-b771-54728cd291fb").click();
  setTimeout(() => {
    document.querySelector('.cle-item').click();
  },100);
  setTimeout(() => {
    teamsMessage('Testing automated responder');
  },1000);
  var new_channels = document.querySelectorAll('.ts-unread-channel');
  console.log(new_channels.length);
  if (new_channels.length > 0){
    for (var i = 0; i < new_channels.length; i++){
      new_channels[i].click();
      setTimeout(() => {
        teamsMessage('Testing automated responder');
      },1000);
    }
  }
  else{
    console.log('no element in new_channels')
  }
  


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

window.sayHello = () => {
  getUnreadMessage();
};

