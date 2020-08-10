// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const axios = require("axios");
const path = require("path");
const isDev = require("electron-is-dev");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync(path.join(app.getPath("userData"), "db.json"));
const db = low(adapter);
// Initialize the db to have 1 service: slack
// Is currently required until we have a function that allows us to add services dynamically
if (!db.has("services").value()) {
  console.log("db is empty, initialize");
  db.set("services", [{ name: "slack" }]).write();
}

let mainWindow;

ipcMain.on("get-services", (event, args) => {
  console.log("getting services from db on app startup");
  const nrOfServices = db.get("services").size().value();
  console.log("main", nrOfServices);
  const services = db.get("services").value();
  console.log("services", services);

  event.reply("get-services", { nrOfServices, services });
});

ipcMain.on("focus-start", (args) => {
  console.log("focus start");
  // 1. Create a focus object in DB to reference and update with data later on

  // 2. Set status of apps to DND if possible

  // 3. Start loop to get messages

  // 4. Send autoresponse if nesessary
});

ipcMain.on("focus-end", (args) => {
  console.log("focus end");
});

function createWindow() {
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
