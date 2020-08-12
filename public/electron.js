// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain,
  session,
  webContents,
  shell,
} = require("electron");
const { setDnd: setDndSlack } = require("./services/slack");
const { setDnd: setDndTeams } = require("./services/teams");

const axios = require("axios");
const path = require("path");
const isDev = require("electron-is-dev");
const { init } = require("./db/db");

// Initialize the db to have 1 service: slack
// Is currently required until we have a function that allows us to add services dynamically
const db = init();

let mainWindow;

ipcMain.on("get-services", (event, args) => {
  const nrOfServices = db.get("services").size().value();
  const services = db.get("services").value();
  console.log("services", services);
  event.reply("get-services", { nrOfServices, services });
});

ipcMain.on("webview-rendered", (event, { name, webContentsId }) => {
  // add reference to db
  db.get("services").find({ name }).assign({ webContentsId }).write();
  const webContent = webContents.fromId(webContentsId);
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
app.whenReady().then(() => {
  createWindow();

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
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
