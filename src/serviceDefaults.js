// This file is a configuration file that defines the default props for each kind of service

import teamsIcon from "./images/icons/teams.svg";
import slackIcon from "./images/icons/slack.svg";
import whatsappIcon from "./images/icons/whatsapp.svg";

export default {
  teams: {
    url: "https://teams.microsoft.com/",
    icon: teamsIcon,
    useragent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:79.0) Gecko/20100101 Firefox/79.0",
  },
  slack: {
    url: "https://app.slack.com/client/",
    icon: slackIcon,
    useragent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:79.0) Gecko/20100101 Firefox/79.0",
  },
  whatsapp: {
    url: "https://web.whatsapp.com/",
    icon: whatsappIcon,
    useragent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:79.0) Gecko/20100101 Firefox/79.0",
  },
};
