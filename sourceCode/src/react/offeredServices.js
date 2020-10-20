// This file is a configuration file that defines the default props for each kind of service

import teamsIcon from "./images/icons/teams.svg";
import slackIcon from "./images/icons/slack.svg";
import whatsappIcon from "./images/icons/whatsapp.svg";
import telegramIcon from "./images/icons/telegram.svg";
//import skypeIcon from "./images/icons/skype.svg";
//import outlookIcon from "./images/icons/outlook.svg";
//import gmailIcon from "./images/icons/gmail.svg";

export default {
  teams: {
    url: "https://teams.microsoft.com/",
    icon: teamsIcon,
    useragent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
  },
  slack: {
    url: "https://app.slack.com/client/",
    icon: slackIcon,
    useragent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:71.0) Gecko/20100101 Firefox/71.0",
  },
  whatsapp: {
    url: "https://web.whatsapp.com/",
    icon: whatsappIcon,
    useragent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
  },
  telegram: {
    url: "https://web.telegram.org/",
    icon: telegramIcon,
    useragent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
  },
  // skype: {
  //   url: "https://web.skype.com/",
  //   icon: skypeIcon,
  //   useragent:
  //     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
  // },
  // outlook: {
  //   url: "https://outlook.live.com/mail/",
  //   icon: outlookIcon,
  //   useragent:
  //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
  // },
  // gmail: {
  //   url: "https://mail.google.com/",
  //   icon: gmailIcon,
  //   useragent:
  //     "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 Edg/12.10136",
  // },
};
