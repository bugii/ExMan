// This file is a configuration file used to easily add services

import teamsIcon from "./images/icons/teams.svg";
import slackIcon from "./images/icons/slack.svg";
import whatsappIcon from "./images/icons/whatsapp.svg";

export default [
  {
    name: "teams",
    url: "https://teams.microsoft.com/",
    icon: teamsIcon,
  },
  {
    name: "slack",
    url: "https://app.slack.com/client/",
    icon: slackIcon,
  },
  {
    name: "whatsapp",
    url: "https://web.whatsapp.com/",
    icon: whatsappIcon,
  },
];
