const { app } = require("electron");
const SlackService = require("./SlackService");
const WhatsappService = require("./WhatsappService");
const { v4: uuidv4 } = require("uuid");
const {
  addService: addServiceDb,
  deleteService: deleteServiceDb,
  getServices: getServicesDb,
} = require("../db/db");
const path = require("path");

const eventEmitter = require("../utils/eventEmitter");
const TeamsService = require("./TeamsService");
const { getMainWindow, getFocus } = require("../db/memoryDb");

const isMac = process.platform === "darwin";
const isWindows = process.platform === "win32";

// This is a singleton object that is used to manage (create, delete, etc) all services in memory

class ServicesManager {
  constructor() {
    this.services = [];
    this.allAuthed = false;
  }

  init() {
    // Init the memory db, create the services objects
    const db_services = getServicesDb();

    db_services.forEach((service) => {
      this.addService(service);
    });
  }

  addService({ id, name, autoResponse }) {
    let s;
    let uuid = id;

    if (!id) {
      uuid = uuidv4();
    }

    switch (name) {
      case "whatsapp":
        s = new WhatsappService(
          uuid,
          autoResponse,
          this.checkIfAllAuthed.bind(this)
        );
        break;

      case "slack":
        s = new SlackService(
          uuid,
          autoResponse,
          this.checkIfAllAuthed.bind(this)
        );
        break;

      case "teams":
        s = new TeamsService(
          uuid,
          autoResponse,
          this.checkIfAllAuthed.bind(this)
        );

      default:
        break;
    }

    this.services.push(s);

    if (!id) {
      addServiceDb({
        id: uuid,
        name: name,
        autoResponse: autoResponse,
      });
    }
  }

  getServices() {
    // returns hard copy of services
    return this.services.map((service) => ({
      id: service.id,
      name: service.name,
      webContentsId: service.webContentsId,
      ready: service.ready,
      authed: service.authed,
      unreadCount: service.unreadCount,
      autoResponse: service.autoResponse,
      loopStarted: service.loopStarted,
    }));
  }

  getServicesComplete() {
    // this returns the entire objects
    // Cannot be used for IPC
    return this.services;
  }

  getService(id) {
    return this.services.find((service) => service.id === id);
  }

  deleteService(id) {
    // delete from memory
    const updated_services = [];
    this.services.forEach(async (service) => {
      if (service.id === id) {
        // End the focus for that service (and also get rid of all the ongoing loops)
        await service.focusEnd();
        await service.endAuthLoop();
        await service.endUnreadLoop();
        await service.endMessagesLoop();
      } else {
        updated_services.push(service);
      }
    });
    this.services = updated_services;
    // delete from db
    deleteServiceDb(id);
  }

  checkIfAllAuthed() {
    for (let index = 0; index < this.services.length; index++) {
      const service = this.services[index];

      if (!service.authed) {
        this.allAuthed = false;
        return;
      }
    }
    if (!this.allAuthed) {
      this.allAuthed = true;
      // only trigger the event if we are actually coming from the state where not all services were authed
      eventEmitter.emit("all-services-authed");
    }
  }

  updateUnreadMessages() {
    let unreadCount = 0;
    this.services.forEach((service) => {
      unreadCount += service.unreadCount;
    });
    if (unreadCount !== 0 && !getFocus()) {
      if (isMac) {
        app.dock.setBadge(unreadCount.toString());
      }
      if (isWindows) {
        getMainWindow().setOverlayIcon(
          path.join(
            __dirname,
            `../assets/taskbar/win/taskbar-${Math.min(unreadCount, 10)}.png`
          ),
          `${Math.min(unreadCount, 10)} unread messages`
        );
      }
    } else {
      if (isMac) {
        app.dock.setBadge("");
      }
      if (isWindows) {
        getMainWindow().setOverlayIcon(null, "no notifications");
      }
    }
  }

  clearSessions() {
    this.services.forEach((service) => {
      service.clearSession();
    });
  }
}

const servicesManagerInstance = new ServicesManager();

module.exports = servicesManagerInstance;
