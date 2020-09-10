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
  getCurrentFocusSession,
  getPreviousFocusSession,
  getAllFocusSessions,
} = require("./db/db");

const focusStart = require("./utils/focusStart");
const focusEnd = require("./utils/focusEnd");
const insertWebviewCss = require("./utils/insertWebviewCss");
const unreadLoopStart = require("./utils/unreadLoopStart");

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
  console.log("getting services", services);
  event.reply("get-services", services);
});

const idsWhereWebviewWasRendered = [];

ipcMain.on("webview-rendered", (event, { id, webContentsId }) => {
  console.log("webview rendered", id, webContentsId);
  const webContent = webContents.fromId(webContentsId);
  // Bring the id into the webview webcontents (to associate the notifications with the right service)
  webContent.send("id", id);
  // Insert Css to make screensharing polyfill work
  insertWebviewCss(webContent, webContentsId);
  if (isDev) webContent.openDevTools();
  // If a user clicks on a link, picture, etc.. open it with the default application, not inside our applicatoin
  webContent.on("new-window", (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });
  webContent.setAudioMuted(true);

  // add reference to db
  db.get("services").find({ id }).assign({ webContentsId }).write();

  // avoid calling the following code multiple times per webview..
  // react calls this on the dom-ready event for the webview,
  // which is why this could be called multiple times -> unnessecary computing
  if (!idsWhereWebviewWasRendered.find((el) => el === id)) {
    // Start checking for unread messages/emails/chats
    unreadLoopStart(webContentsId, mainWindow.webContents);
    idsWhereWebviewWasRendered.push(id);
  }
});

let intervallRefs = [];
let focusEndTimeoutRef = null;

ipcMain.on("focus-start-request", (e, { startTime, endTime }) => {
  console.log("focus requested from react", startTime, endTime);
  intervallRefs = focusStart(startTime, endTime);

  //TODO: add option to delay start of focus session, or add function to schedule session

  // if focus start successful, update the react app
  e.reply("focus-start-successful", { startTime, endTime });
  // schedule automatic focus end
  focusEndTimeoutRef = setTimeout(() => {
    focusEnd(intervallRefs);
    // tell react that focus has ended, so it can update the state
    e.reply("focus-end-successful");
  }, endTime - new Date().getTime());
});

ipcMain.on("focus-end-request", (e) => {
  console.log("focus end request from react");
  focusEnd(intervallRefs);
  clearTimeout(focusEndTimeoutRef);
  // if focus end successful, update the react app
  e.reply("focus-end-successful");
});

ipcMain.on("current-focus-request", (e) => {
  console.log("current focus request from react");
  const currentFocus = getCurrentFocusSession();
  console.log(currentFocus);
  e.reply(currentFocus);
});

ipcMain.on("notification", (event, { id, title, body }) => {
  const currentFocus = getCurrentFocusSession();
  if (!currentFocus) {
    console.log("forward notification", id);
    // forward notification
    new Notification({ title, body, silent: true }).show();
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

ipcMain.on("get-previous-focus-session", (e, args) => {
  e.reply("get-previous-focus-session", getPreviousFocusSession());
});

ipcMain.on("get-all-past-focus-sessions", (e, args) => {
  e.reply("get-all-past-focus-sessions", getAllFocusSessions());
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
  if (isDev) mainWindow.webContents.openDevTools({ mode: "detach" });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  createWindow();

  // ask for permissions (mic, camera and screen capturing) on a mac
  if (isMac) {
    setTimeout(async () => {
      await systemPreferences.askForMediaAccess("microphone");
      await systemPreferences.askForMediaAccess("camera");
      if (!hasPromptedForPermission()) {
        hasScreenCapturePermission();
      }
    }, 5000);
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
