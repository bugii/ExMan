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
  getPreviousFocusSession,
  getAllFocusSessions,
  deleteFutureFocusSession,
  updateAutoresponse,
  getAllFutureFocusSessions,
  setEndTime,
  setFocusGoals,
  setCompletedGoals,
  setRating,
  storeBreakFocusClicks,
  updateBreakFocusPerService,
  storeRandomSurveyResults,
  storeDefaultFocusSession,
  getSettings,
  storeAppStart,
  storeActiveWindowInArchive,
  storeActiveWindowInCurrentFocus,
  storeServiceInteractionStartInCurrentFocus,
  storeServiceInteractionEndInCurrentFocus,
  storeServiceInteractionStartInArchive,
  storeServiceInteractionEndInArchive,
} = require("./db/db");

const focusStart = require("./utils/focusStart");
const focusEnd = require("./utils/focusEnd");
const insertWebviewCss = require("./utils/insertWebviewCss");
const scheduleFocus = require("./utils/scheduleFocus");
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
const isOverlappingWithFocusSessions = require("./utils/isOverlappingWithFocusSessions");
const isWrongFocusDuration = require("./utils/isWrongFocusDuration");
const scheduleRandomPopup = require("./utils/scheduleRandomPopup");
const updater = require("./utils/updater");
const {
  getServicesComplete,
  getService,
} = require("./services/ServicesManger");
const createTray = require("./utils/createTray");
const activeWin = require("active-win");

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

ipcMain.on("refresh-service", (e, id) => {
  console.log(`refreshing ${id}`);
  servicesManager.refreshService(id);
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
  // if already in focus mode -> can't start again
  if (getFocus()) {
    e.reply("error", "/already-focused");
    console.log("error starting focus session - already in focus");
    return;
  }
  // if there is an overlap with a future focus session -> can't start
  if (isOverlappingWithFocusSessions(startTime, endTime)) {
    e.reply("error", "/focus-overlap");
    console.log(
      "error starting focus session - overlap with current or future focus session"
    );
    return;
  }
  if (isWrongFocusDuration(startTime, endTime)) {
    e.reply("error", "/wrong-duration");
    console.log(
      "error wrong focus duration - either negative value or over 10h"
    );
    return;
  }

  focusStart(startTime, endTime);
});

ipcMain.on("focus-schedule-request", (e, { startTime, endTime }) => {
  console.log("schedule focus request from react", startTime, endTime);

  if (isOverlappingWithFocusSessions(startTime, endTime)) {
    e.reply("error", "/focus-overlap");
    console.log(
      "error scheduling focus session - overlap with current or future focus session"
    );
    return;
  }
  if (isWrongFocusDuration(startTime, endTime)) {
    e.reply("error", "/wrong-duration");
    console.log(
      "error wrong focus duration - either negative value or over 10h"
    );
    return;
  }

  scheduleFocus(startTime, endTime);
});

ipcMain.on("focus-goals-request", (e, { goals, completedGoals }) => {
  console.log("focus goal request from react", goals);
  setFocusGoals(goals);
  setCompletedGoals(completedGoals);
  // if focus goals were set successfully, update the react app
  e.reply("current-focus-request", getCurrentFocusSession());
});

ipcMain.on("focus-end-request", (e) => {
  console.log("focus end request from react");
  focusEnd();
  // if focus end successful, update the react app
  e.reply("focus-end-successful");
});

ipcMain.on("previous-session-update", (e, { rating, completedGoals }) => {
  console.log("previous session update");
  // submit rating value to focus session
  setRating(rating);
  // update goals with which were accomplished
  setCompletedGoals(completedGoals);
});

ipcMain.on("random-popup-submission", (e, { productivity, wasMinimized }) => {
  console.log(`random popup survey submission, productivity: ${productivity}`);
  storeRandomSurveyResults({ productivity });
  if (wasMinimized) {
    getMainWindow().minimize();
  }
  scheduleRandomPopup();
});

ipcMain.on("notification", (event, { id, title, body }) => {
  if (!getFocus()) {
    console.log("forward notification", id);
    // forward notification
    // try to send it to renderer and use html notifcation api there
    getMainWindow().send("notification", { id, title, body });
    // Also store the notification in archive
    servicesManager.getService(id).handleNotification(false, title, body);
  } else {
    console.log("block notification", id);
    // if there is a focus session ongoing, store the notification
    servicesManager.getService(id).handleNotification(true, title, body);
  }
});

ipcMain.on("notification-clicked", (e, id) => {
  console.log("clicked on notification", id);
  getMainWindow().restore();
  getMainWindow().show();
  openService(id);
});

ipcMain.on("get-previous-focus-session", (e, args) => {
  e.reply("get-previous-focus-session", getPreviousFocusSession());
});

ipcMain.on("get-all-past-focus-sessions", (e, args) => {
  e.reply("get-all-past-focus-sessions", getAllFocusSessions());
});

ipcMain.on("cancel-future-focus-session", (e, sessionId) => {
  console.log("delete future session, id: ", sessionId);
  deleteFutureFocusSession(sessionId);
  e.reply("get-all-future-focus-sessions", getAllFutureFocusSessions());
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

ipcMain.on("breakFocus", (e, breakFocusEnd) => {
  storeBreakFocusClicks(breakFocusEnd);
});

ipcMain.on("get-all-future-focus-sessions", (e, args) => {
  e.reply("get-all-future-focus-sessions", getAllFutureFocusSessions());
});

ipcMain.on("updateDefaultDuration", (e, { type, value }) => {
  storeDefaultFocusSession(type, value);
});

ipcMain.on("get-settings", (e) => {
  e.reply("get-settings", getSettings());
});

let lastId = null;

ipcMain.on("route-changed", (e, location) => {
  if (location.pathname.includes("/services")) {
    // navigated to service route
    const splitArray = location.pathname.split("/");
    const id = splitArray[splitArray.length - 1];
    if (getFocus()) {
      storeServiceInteractionStartInCurrentFocus(id);
      if (lastId !== null) {
        storeServiceInteractionEndInCurrentFocus(lastId);
      }
    } else {
      storeServiceInteractionStartInArchive(id);
      if (lastId !== null) {
        storeServiceInteractionEndInArchive(lastId);
      }
    }
    lastId = id;
  } else {
    // navigated to non-service page
    if (getFocus()) {
      if (lastId !== null) {
        storeServiceInteractionEndInCurrentFocus(lastId);
      }
    } else {
      if (lastId !== null) {
        storeServiceInteractionEndInArchive(lastId);
      }
    }
    lastId = null;
  }
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
    getMainWindow().send("update-frontend", {
      services: servicesManager.getServices(),
      currentFocusSession: getCurrentFocusSession(),
    });
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
  }, 10000);
  storeIntervallRef(windowTrackerIntervall);

  getMainWindow().on("close", (e) => {
    console.log(
      "close window, deleting all the timeouts and intervalls in memory"
    );
    if (getFocus()) {
      if (lastId !== null) {
        storeServiceInteractionEndInCurrentFocus(lastId);
      }
    } else {
      if (lastId !== null) {
        storeServiceInteractionEndInArchive(lastId);
      }
    }
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
