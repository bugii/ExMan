const { session } = require("electron");

const sendMessage = (token) => {
  session.defaultSession.cookies
    .get({ url: "https://slack.com" })
    .then(async (cookies) => {
      let stringCookie = "";

      cookies.forEach((cookie) => {
        if (cookie.name == "d") {
          stringCookie = `${cookie.name}=${cookie.value};`;
        }
      });

      console.log(stringCookie);

      var axios = require("axios");
      var data = JSON.stringify({
        text: "POST from Electron Main process",
        channel: "D015HNN3JF9",
      });

      var config = {
        method: "post",
        url: "https://slack.com/api/chat.postMessage",
        headers: {
          Cookie: stringCookie,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
    });
};

module.exports = {
  sendMessage,
};
