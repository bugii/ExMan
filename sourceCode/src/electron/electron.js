// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain,
  webContents,
  shell,
  systemPreferences,
  Menu,
} = require("electron");

require("./ipc/autoResponse");
require("./ipc/calendar");
require("./ipc/focus");
require("./ipc/forms");
require("./ipc/navigation");
require("./ipc/notifications");
require("./ipc/services");
require("./ipc/settings");
require("./ipc/goals");
require("./ipc/dashboard");

require("../express/express");

const log = require("electron-log");

const {
  hasScreenCapturePermission,
  hasPromptedForPermission,
} = require("mac-screen-capture-permissions");

const path = require("path");
const isDev = require("electron-is-dev");
const {
  init: db_init,
  getCurrentFocusSession,
  storeAppStart,
  storeActiveWindowInArchive,
  storeActiveWindowInCurrentFocus,
  storeServiceInteractionEndInCurrentFocus,
  storeServiceInteractionEndInArchive,
} = require("./db/db");
const insertWebviewCss = require("./utils/insertWebviewCss");

const {
  storeMainWindow,
  getMainWindow,
  getFocus,
  storeIntervallRef,
  storeTimeoutRef,
} = require("./db/memoryDb");

const exportDb = require("./utils/exportDb");
const servicesManager = require("./services/ServicesManger");
const eventEmitter = require("./utils/eventEmitter");
const allServicesAuthedHandler = require("./utils/allServicesAuthedHandler");
const handleWindowClose = require("./utils/handleWindowClose");
const scheduleRandomPopup = require("./utils/scheduleRandomPopup");
const updater = require("./utils/updater");

const createTray = require("./utils/createTray");
const activeWin = require("active-win");
const updateFrontend = require("./utils/updateFrontend");

const isMac = process.platform === "darwin";

console.log = log.log;

console.log("starting app");
// Initialize db
db_init();
storeAppStart();

servicesManager.init();

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
    label: "File",
    submenu: [
      {
        label: "Export",
        click: () => {
          exportDb();
        },
      },
    ],
  },
  {
    label: "Edit",
    role: "editMenu",
  },
  {
    label: "Dev",
    submenu: [{ role: "reload" }, { role: "forceReload" }],
  },
]);

Menu.setApplicationMenu(mainMenu);

eventEmitter.on("all-services-authed", allServicesAuthedHandler);

ipcMain.on("update-frontend", (e) => {
  console.log("update frontend");
  updateFrontend();
});

ipcMain.on("update-frontend-sync", (e) => {
  console.log("update frontend sync");
  const services = servicesManager.getServices();
  const currentFocusSession = getCurrentFocusSession();
  e.returnValue = { services, currentFocusSession };
});

ipcMain.on("webview-rendered", (event, { id, webContentsId }) => {
  console.log("webview rendered", id);
  const service = servicesManager.getService(id);

  // console.log("webview rendered", id, webContentsId);
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

  service.setWebcontentsId(webContentsId);
  service.startLoop();
});

async function createWindow() {
  // Main Browser Window
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      enableRemoteModule: true,
    },
  });

  // Used to get the directory of the public folder into the react app (required for preload scripts)
  app.dirname = __dirname;

  await mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../../../build/index.html")}`
  );
  if (isDev) mainWindow.webContents.openDevTools({ mode: "detach" });
  storeMainWindow(mainWindow);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(async () => {
  await createWindow();
  createTray();

  scheduleRandomPopup();
  servicesManager.clearSessions();

  getMainWindow().send("update-frontend", {
    services: servicesManager.getServices(),
    currentFocusSession: getCurrentFocusSession(),
  });

  //Update renderer loop
  console.log("update loop start");
  const ref = setInterval(async () => {
    updateFrontend();
    servicesManager.updateUnreadMessages();
  }, 1000);
  storeIntervallRef(ref);

  // ask for permissions (mic, camera and screen capturing) on a mac
  if (isMac) {
    const ref = setTimeout(async () => {
      await systemPreferences.askForMediaAccess("microphone");
      await systemPreferences.askForMediaAccess("camera");
      if (!hasPromptedForPermission()) {
        hasScreenCapturePermission();
      }
    }, 5000);
    storeTimeoutRef(ref);
  }

  setTimeout(updater, 10000);
  const windowTrackerIntervall = setInterval(async () => {
    const activeWindow = await activeWin();
    if (activeWindow) {
      if (getFocus()) {
        storeActiveWindowInCurrentFocus({
          name: activeWindow.owner.name,
          title: activeWindow.title,
        });
      } else {
        storeActiveWindowInArchive({
          name: activeWindow.owner.name,
          title: activeWindow.title,
        });
      }
    }
  }, 10000);
  storeIntervallRef(windowTrackerIntervall);

  getMainWindow().on("close", (e) => {
    console.log(
      "close window, deleting all the timeouts and intervalls in memory"
    );
    handleWindowClose();
  });

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  app.quit();
});
