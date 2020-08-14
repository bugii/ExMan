// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain,
  session,
  webContents,
  shell,
  systemPreferences,
  Menu,
} = require("electron");
const { setDnd: setDndSlack } = require("./services/slack");
const { setDnd: setDndTeams } = require("./services/teams");
const {
  hasScreenCapturePermission,
  hasPromptedForPermission,
} = require("mac-screen-capture-permissions");
const axios = require("axios");
const path = require("path");
const isDev = require("electron-is-dev");
const { init, addService, getServices, deleteService } = require("./db/db");

const isMac = process.platform === "darwin";

// Initialize db or if there are services stored in the db, use them
const db = init();

let mainWindow;
let mainMenu;

mainMenu = Menu.buildFromTemplate([
  isMac
    ? {
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
      }
    : {},
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forcereload" },
      { role: "toggledevtools" },
    ],
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

ipcMain.on("webview-rendered", (event, { name, webContentsId }) => {
  // add reference to db
  db.get("services").find({ name }).assign({ webContentsId }).write();
  const webContent = webContents.fromId(webContentsId);
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
  //el.setAudioMuted(true);
});

ipcMain.on("focus-start", (args) => {
  console.log("focus start");
  // 1. Create a focus object in DB to reference and update with data later on

  // 2. Set status of apps to DND if possible
  setDndSlack();
  setDndTeams();
  // 3. Start loop to get messages

  // 4. Send autoresponse if nesessary
});

ipcMain.on("focus-end", (args) => {
  console.log("focus end");
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
  if (process.platform === "darwin") {
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

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
