const { webContents } = require("electron");
const { getDb, getServices } = require("../db/db");

function unreadLoopStart(webContentsId, reactWebContent) {
  console.log("unread loop start");
  const service = getDb().get("services").find({ webContentsId }).value();
  const serviceWebcontents = webContents.fromId(webContentsId);

  let intervallRef;
  let unreadChats;

  intervallRef = setInterval(async () => {
    switch (service.name) {
      case "slack":
        break;

      case "teams":
        unreadChats = await serviceWebcontents.executeJavaScript(
          "window.getUnreadChats()"
        );
        console.log("unread chats teams", unreadChats);
        getDb()
          .get("services")
          .find({ id: service.id })
          .assign({ unreadCount: unreadChats })
          .write();

        break;

      case "skype":
        unreadChats = await serviceWebcontents.executeJavaScript(
          "window.getUnreadChats()"
        );
        console.log("unread chats skype", unreadChats);
        getDb()
          .get("services")
          .find({ id: service.id })
          .assign({ unreadCount: unreadChats })
          .write();

        break;

      case "whatsapp":
        unreadChats = await serviceWebcontents.executeJavaScript(
          "window.getUnreadChats()"
        );
        console.log("unread chats whatsapp", unreadChats);
        getDb()
          .get("services")
          .find({ id: service.id })
          .assign({ unreadCount: unreadChats })
          .write();

        break;

      case "gmail":
        break;

      case "outlook":
        break;

      default:
        break;
    }

    // Update renderer
    reactWebContent.send("update-services", getServices());
  }, 10000);
}

module.exports = unreadLoopStart;
