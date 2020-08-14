// This file is a configuration file that defines the default props for each kind of service

import teamsIcon from "./images/icons/teams.svg";
import slackIcon from "./images/icons/slack.svg";
import whatsappIcon from "./images/icons/whatsapp.svg";
import skypeIcon from "./images/icons/skype.svg";

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
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
  },
  whatsapp: {
    url: "https://web.whatsapp.com/",
    icon: whatsappIcon,
    useragent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
  },
  skype: {
    url: "https://web.skype.com/",
    icon: skypeIcon,
    useragent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36",
  },
};
