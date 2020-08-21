// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain,
  Notification,
  webContents,
  shell,
  systemPreferences,
  Menu,
} = require("electron");

const {
  setDnd: setDndSlack,
  setOnline: setOnlineSlack,
  getMessages: getMessagesSlack,
} = require("./services/slack");
const {
  setDnd: setDndTeams,
  setOnline: setOnlineTeams,
  getMessages: getMessagesTeams,
} = require("./services/teams");
const { setDnd: setDndWhatsapp } = require("./services/whatsapp");

const {
  hasScreenCapturePermission,
  hasPromptedForPermission,
} = require("mac-screen-capture-permissions");
const axios = require("axios");
const path = require("path");
const isDev = require("electron-is-dev");
const {
  init,
  getDb,
  addService,
  getServices,
  deleteService,
  createFocusSession,
  endCurrentFocusSession,
  getCurrentFocusSession,
} = require("./db/db");

const isMac = process.platform === "darwin";

// Initialize db or if there are services stored in the db, use them
const db = init();

let mainWindow;
let mainMenu;

mainMenu = Menu.buildFromTemplate([
  {
    label: "ExMan",
    submenu: [
      { role: "about" },
      { type: "separator" },
      { role: "services" },
      { type: "separator" },
      { role: "hide" },
      { role: "hideothers" },
      { role: "unhide" },
      { type: "separator" },
      { role: "quit" },
    ],
  },
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forcereload" },
      { role: "toggledevtools" },
    ],
  },
  {
    label: "Edit",
    role: "editMenu",
  },
]);

Menu.setApplicationMenu(mainMenu);

ipcMain.on("add-service", (event, name) => {
  console.log("add service", name);
  const services = addService(name);
  mainWindow.webContents.send("update-services", services);
});

ipcMain.on("delete-service", (event, id) => {
  console.log("delete service", id);
  const services = deleteService(id);
  mainWindow.webContents.send("update-services", services);
});

ipcMain.on("get-services", (event, args) => {
  const services = getServices();
  console.log("services", services);
  event.reply("get-services", services);
});

ipcMain.on("webview-rendered", (event, { id, webContentsId }) => {
  // add reference to db
  db.get("services").find({ id }).assign({ webContentsId }).write();
  const webContent = webContents.fromId(webContentsId);
  // Bring the id into the webview webcontents (to associate the notifications with the right service)
  webContent.send("id", id);

  webContent.insertCSS(`
  .desktop-capturer-selection {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(30, 30, 30, 0.75);
    color: #fff;
    z-index: 10000000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .desktop-capturer-selection__scroller {
    width: 100%;
    max-height: 100vh;
    overflow-y: auto;
  }
  .desktop-capturer-selection__list {
    max-width: calc(100% - 100px);
    margin: 50px;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    overflow: hidden;
    justify-content: center;
  }
  .desktop-capturer-selection__item {
    display: flex;
    margin: 4px;
  }
  .desktop-capturer-selection__btn {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 145px;
    margin: 0;
    border: 0;
    border-radius: 3px;
    padding: 4px;
    background: #252626;
    text-align: left;
    transition: background-color 0.15s, box-shadow 0.15s;
  }
  .desktop-capturer-selection__btn:hover,
  .desktop-capturer-selection__btn:focus {
    background: rgba(98, 100, 167, 0.8);
  }
  .desktop-capturer-selection__thumbnail {
    width: 100%;
    height: 81px;
    object-fit: cover;
  }
  .desktop-capturer-selection__name {
    margin: 6px 0 6px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  `);
  webContent.openDevTools();
  webContent.on("new-window", (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });

  // you can disable audio on the webview
  // el.setAudioMuted(true);
});

// variable used for Slack auto-reply loop
let currentFocusSessionIntervalSlack;
let currentFocusSessionIntervalTeams;

ipcMain.on("focus-start", (event, { startTime, endTime, diffMins }) => {
  console.log("focus start from", startTime, "to", endTime);
  // 1. Create a focus object in DB to reference and update with data later on
  createFocusSession(startTime, endTime);

  // 2. Set status of apps to DND if possible
  // Get all registered services
  const currentFocusSession = getCurrentFocusSession();
  currentFocusSession.services.forEach((service) => {
    switch (service.name) {
      case "slack":
        setDndSlack(service.webContentsId, diffMins);
        currentFocusSessionIntervalSlack = setInterval(function () {
          var startTime = new Date().getTime() / 1000 - 20;
          getMessagesSlack(
            service.webContentsId,
            startTime,
            "Hello from ExMan"
          );
        }, 20000);
        break;

      case "teams":
        setDndTeams(service.webContentsId);
        var startTime = new Date().getTime() / 1000 - 60;
        currentFocusSessionIntervalTeams = setInterval(function () {
          const currentTeamsSession = getDb()
            .get("currentFocusSession")
            .get("services")
            .find({ webContentsId: service.webContentsId })
            .value();

          getMessagesTeams(
            service.webContentsId,
            startTime,
            currentTeamsSession ? currentTeamsSession["syncToken"] : null
          );
        }, 20000);
        break;

      case "skype":
        break;

      case "whatsapp":
        break;

      default:
        break;
    }
  });
});

ipcMain.on("focus-end", (args) => {
  console.log("focus end");
  //get ongoing focus sessions
  const currentFocusSession = getCurrentFocusSession();
  // TODO: set status to active again for all services -> use 'setOnline' function
  currentFocusSession.services.forEach((service) => {
    switch (service.name) {
      case "slack":
        // stop slack auto-reply loop
        clearInterval(currentFocusSessionIntervalSlack);
        // stop dnd mode on slack
        setOnlineSlack(service.webContentsId);
        break;

      case "teams":
        // stop teams auto-reply loop
        clearInterval(currentFocusSessionIntervalTeams);
        // stop dnd mode on teams
        setOnlineTeams(service.webContentsId);
        break;

      case "skype":
        break;

      case "whatsapp":
        break;

      default:
        break;
    }
  });
  // remove current focus session from db
  endCurrentFocusSession();
});

ipcMain.on("notification", (event, { id, title, body }) => {
  const currentFocus = getCurrentFocusSession();
  if (!currentFocus) {
    console.log("forward notification", id);
    // forward notification
    new Notification({ title, body }).show();
  } else {
    console.log("block notification", id);
    // if there is a focus session ongoing, store the notification
    getDb()
      .get("currentFocusSession")
      .get("services")
      .find({ id })
      .get("messages")
      .push({ title, body })
      .write();
  }
});

async function createWindow() {
  // If you want to clear cache (helpful for testing new users)
  // await session.defaultSession.clearStorageData();

  // Main Browser Window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
    },
  });

  // Used to get the directory of the public folder into the react app (required for preload scripts)
  app.dirname = __dirname;

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.webContents.openDevTools({ mode: "detach" });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  createWindow();

  // ask for permissions (mic, camera and screen capturing) on a mac
  if (isMac) {
    await systemPreferences.askForMediaAccess("microphone");
    await systemPreferences.askForMediaAccess("camera");
    if (!hasPromptedForPermission()) {
      hasScreenCapturePermission();
    }
  }

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  app.quit();
});
