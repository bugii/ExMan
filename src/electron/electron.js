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

const path = require("path");
const isDev = require("electron-is-dev");
const {
  init: db_init,
  getCurrentFocusSession,
  getPreviousFocusSession,
  getAllFocusSessions,
  updateAutoresponse,
  getAllFutureFocusSessions,
  setEndTime,
  setFocusGoals,
  storeNotification,
  storeNotificationInArchive,
} = require("./db/db");

const focusStart = require("./utils/focusStart");
const focusEnd = require("./utils/focusEnd");
const insertWebviewCss = require("./utils/insertWebviewCss");
const scheduleFocus = require("./utils/scheduleFocus");
const { storeMainWindow, getMainWindow, getFocus } = require("./db/memoryDb");
const exportDb = require("./utils/exportDb");
const servicesManager = require("./services/ServicesManger");
const eventEmitter = require("./utils/eventEmitter");
const allServicesAuthedHandler = require("./utils/allServicesAuthedHandler");

const isMac = process.platform === "darwin";

// Initialize db
db_init();
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

ipcMain.on("add-service", (event, name) => {
  console.log("add service", name);
  servicesManager.addService({ id: null, name, autoResponse: false });
});

ipcMain.on("delete-service", (event, id) => {
  console.log("delete service", id);
  servicesManager.deleteService(id);
});

ipcMain.on("update-frontend", (e) => {
  console.log("update frontend");
  const services = servicesManager.getServices();
  const currentFocusSession = getCurrentFocusSession();
  e.reply("update-frontend", { services, currentFocusSession });
});

ipcMain.on("update-frontend-sync", (e) => {
  console.log("update frontend sync");
  const services = servicesManager.getServices();
  const currentFocusSession = getCurrentFocusSession();
  e.returnValue = { services, currentFocusSession };
});

ipcMain.on("refresh-service", (e, webContentsId) => {
  console.log(`refreshing ${webContentsId}`);
  webContents.fromId(webContentsId).reload();
});

ipcMain.on("webview-rendered", (event, { id, webContentsId }) => {
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

ipcMain.on("focus-start-request", (e, { startTime, endTime }) => {
  console.log("focus requested from react", startTime, endTime);
  focusStart(startTime, endTime);
});

ipcMain.on("focus-schedule-request", (e, { startTime, endTime }) => {
  console.log("schedule focus request from react", startTime, endTime);
  scheduleFocus(startTime, endTime);
});

ipcMain.on("focus-goals-request", (e, { goals }) => {
  console.log("focus goal request from react", goals);
  setFocusGoals(goals);
  // if focus goals were set successfully, update the react app
  e.reply("current-focus-request", getCurrentFocusSession());
});

ipcMain.on("focus-end-request", (e) => {
  console.log("focus end request from react");
  // manually set the endTime of the focus session to the current time. This results in endTime != originalEndTime -> we can see which sessions were aborted manually
  setEndTime(new Date().getTime());
  focusEnd();
  // if focus end successful, update the react app
  e.reply("focus-end-successful");
});

ipcMain.on("notification", (event, { id, title, body }) => {
  if (!getFocus()) {
    console.log("forward notification", id);
    // forward notification
    const notification = new Notification({ title, body, silent: true });
    notification.on("click", () => {
      getMainWindow().show();
      openService(id);
    });
    notification.show();
    // Also store the notification in archive
    storeNotificationInArchive(id);
  } else {
    console.log("block notification", id);
    // if there is a focus session ongoing, store the notification
    storeNotification(id, title, body);
  }
});

ipcMain.on("get-previous-focus-session", (e, args) => {
  e.reply("get-previous-focus-session", getPreviousFocusSession());
});

ipcMain.on("get-all-past-focus-sessions", (e, args) => {
  e.reply("get-all-past-focus-sessions", getAllFocusSessions());
});

ipcMain.on("updateAutoResponse", (e, message) => {
  updateAutoresponse(message);
});

ipcMain.on("toggleAutoResponse", (e, id) => {
  const service = servicesManager.getService(id);
  service.toggleAutoResponseAvailablity();
});

ipcMain.on("getAutoResponseStatus", (e, id) => {
  const service = servicesManager.getService(id);
  return service.autoResponse;
});

ipcMain.on("get-all-future-focus-sessions", (e, args) => {
  e.reply("get-all-future-focus-sessions", getAllFutureFocusSessions());
});

const openService = (id) => {
  // If a new notification comes in, open the corresponding service in the frontend
  getMainWindow().webContents.send("open-service", id);
};

async function createWindow() {
  // Main Browser Window
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      //   webSecurity: isDev ? false : true,
    },
  });

  // Used to get the directory of the public folder into the react app (required for preload scripts)
  app.dirname = __dirname;

  await mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../../build/index.html")}`
  );
  if (isDev) mainWindow.webContents.openDevTools({ mode: "detach" });
  storeMainWindow(mainWindow);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  await createWindow();

  getMainWindow().send("update-frontend", {
    services: servicesManager.getServices(),
    currentFocusSession: getCurrentFocusSession(),
  });

  //Update renderer loop
  console.log("update loop start");
  setInterval(() => {
    getMainWindow().send("update-frontend", {
      services: servicesManager.getServices(),
      currentFocusSession: getCurrentFocusSession(),
    });
  }, 1000);

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
