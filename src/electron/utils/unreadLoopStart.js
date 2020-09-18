const { getDb, getServices } = require("../db/db");
const { getMainWindow } = require("../db/memoryDb");

const { getUnreadChats: getUnreadChatsGmail } = require("../services/gmail");
const {
  getUnreadChats: getUnreadChatsOutlook,
} = require("../services/outlook");
const { getUnreadChats: getUnreadChatsSkype } = require("../services/skype");
const { getUnreadChats: getUnreadChatsSlack } = require("../services/slack");
const { getUnreadChats: getUnreadChatsTeams } = require("../services/teams");
const {
  getUnreadChats: getUnreadChatsWhatsapp,
} = require("../services/whatsapp");

async function unreadLoopStart(webContentsId) {
  console.log(`unread loop start ${webContentsId}`);
  const service = getDb().get("services").find({ webContentsId }).value();

  let intervallRef;

  intervallRef = setInterval(async () => {
    switch (service.name) {
      case "slack":
        const unreadChatsSlack = await getUnreadChatsSlack(
          service.webContentsId
        );
        //console.log("unread chats slack", unreadChatsSlack);
        getDb()
          .get("services")
          .find({ id: service.id })
          .assign({ unreadCount: unreadChatsSlack })
          .write();

        break;

      case "teams":
        const unreadChatsTeams = await getUnreadChatsTeams(
          service.webContentsId
        );
        //console.log("unread chats teams", unreadChatsTeams);
        getDb()
          .get("services")
          .find({ id: service.id })
          .assign({ unreadCount: unreadChatsTeams })
          .write();

        break;

      case "skype":
        const unreadChatsSkype = await getUnreadChatsSkype(
          service.webContentsId
        );
        //console.log("unread chats skype", unreadChatsSkype);
        getDb()
          .get("services")
          .find({ id: service.id })
          .assign({ unreadCount: unreadChatsSkype })
          .write();

        break;

      case "whatsapp":
        const unreadChatsWhatsapp = await getUnreadChatsWhatsapp(
          service.webContentsId
        );
        //console.log("unread chats whatsapp", unreadChatsWhatsapp);
        getDb()
          .get("services")
          .find({ id: service.id })
          .assign({ unreadCount: unreadChatsWhatsapp })
          .write();

        break;

      case "gmail":
        const unreadChatsGmail = await getUnreadChatsGmail(
          service.webContentsId
        );
        //console.log("unread emails gmail", unreadChatsGmail);
        getDb()
          .get("services")
          .find({ id: service.id })
          .assign({ unreadCount: unreadChatsGmail })
          .write();
        break;

      case "outlook":
        const unreadChatsOutlook = await getUnreadChatsOutlook(
          service.webContentsId
        );
        //console.log("unread emails outlook", unreadChatsOutlook);
        getDb()
          .get("services")
          .find({ id: service.id })
          .assign({ unreadCount: unreadChatsOutlook })
          .write();

        break;

      default:
        break;
    }
  }, 1000);
}

module.exports = unreadLoopStart;
