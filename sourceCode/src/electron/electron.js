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
require("./ipc/auth");
require("./ipc/export");
require("./ipc/tray");

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
    storeAppEnd,
    closeAnyOpenInteractionArray,
    storeBreakFocusClicks,
} = require("./db/db");
const insertWebviewCss = require("./utils/insertWebviewCss");

const {
    storeMainWindow,
    storeTimeoutRef,
    getMainWindow,
} = require("./db/memoryDb");

const {showAboutWindow} = require("electron-util");
const servicesManager = require("./services/ServicesManger");
const eventEmitter = require("./utils/eventEmitter");
const allServicesAuthedHandler = require("./utils/allServicesAuthedHandler");
const updater = require("./utils/updater");

const createOrUpdateTray = require("./utils/createOrUpdateTray");
const updateFrontend = require("./utils/updateFrontend");
const reminderLoop = require("./utils/reminderLoop");
const windowTrackerLoop = require("./utils/windowTrackerLoop");
const {createExportWindow} = require("./utils/exportHelper");

const isMac = process.platform === "darwin";
const isWindows = process.platform === "win32";

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (getMainWindow()) {
      if (getMainWindow().isMinimized()) getMainWindow().restore();
      getMainWindow().show();
      getMainWindow().focus();
    }
  });
}

console.log = log.log;

console.log("starting app");
// Automatically start app on login
app.setLoginItemSettings({
    openAtLogin: true,
});
// Initialize db
db_init();
storeAppStart();
servicesManager.init();

let mainMenu;

mainMenu = Menu.buildFromTemplate([
    {
        label: "ExMan",
        submenu: [
            {
                label: "About",
                click: () => {
                    showAboutWindow({
                        icon: path.join(__dirname, "./assets/icon.png"),
                        copyright: "Copyright © University of Zurich",
                        text:
                            "Authors:\n" +
                            "Taylor McCants (MS Student, UZH): " +
                            "taylor.mccants@uzh.ch" +
                            "\n" +
                            "Dario Bugmann (MS Student, UZH): " +
                            "dario.bugmann@uzh.ch" +
                            "\n" +
                            "Lutharsanen Kunam (MS Student, UZH): " +
                            "lutharsanen.kunam@uzh.ch" +
                            "\n" +
                            "\n" +
                            "Releases:\n" +
                            "https://github.com/bugii/ExMan/releases" +
                            "\n" +
                            "\n" +
                            "Privacy Statement:\n" +
                            "Participation Consent Form - https://drive.google.com/file/d/11LHyJ4bB6ESbk6xAEyCjNcZ-MlwAK8CP/view?usp=sharing" +
                            "\n" +
                            "\n" +
                            "Credits:\n" +
                            "?????\n",
                    });
                },
            },

            ...(isMac ? [
                {type: "separator"},
                {role: "hide"},
                {role: "hideothers"},
                {role: "unhide"}
            ] : []),
            {type: "separator"},
            {role: "quit"}]
    },
    {
        label: "File",
        submenu: [
            ...(isMac ? [{role: "close"}] : []),
            {
                label: "Export",
                click: () => {
                    createExportWindow();
                },
            },
            {
                label: "Open logs folder",
                click: () => {
                    a
                    const logPath = isMac
                        ? "Library/Logs/exman/"
                        : isWindows
                            ? "AppData/Roaming/exman/logs/"
                            : "/.config/exman/logs/";

                    const fullPath = path.join(app.getPath("home"), logPath);
                    shell.showItemInFolder(fullPath);
                    console.log(fullPath);
                },
            },
        ],
    },
    {
        label: "Edit",
        role: "editMenu",
    },
    {role: "windowMenu"},
    {
        label: "Dev",
        submenu: [{role: "reload"}, {role: "forceReload"}],
    },
    {
        label: "Help",
        submenu: [{
            label: "How-To Guide", click: () => {
                shell.openExternal('https://docs.google.com/document/d/12lj2ryBD7IoxzkfaNuJYv1oBVX_CfPxNuDg8B5_ffck/edit?usp=sharing')
            }
        }]
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
    e.returnValue = {services, currentFocusSession};
});

const webviewsRendered = [];

ipcMain.on("webview-rendered", (event, {id, webContentsId}) => {
    console.log("webview rendered", id);
    const service = servicesManager.getService(id);

    // console.log("webview rendered", id, webContentsId);
    const webContent = webContents.fromId(webContentsId);
    // Bring the id into the webview webcontents (to associate the notifications with the right service)
    webContent.send("id", id);
    // Insert Css to make screensharing polyfill work
    insertWebviewCss(webContent, webContentsId);
    if (isDev) webContent.openDevTools();

    service.setWebcontentsId(webContentsId);
    service.startLoop();

    if (!webviewsRendered.find((el) => el === webContentsId)) {
        // If a user clicks on a link, picture, etc.. open it with the default application, not inside our application
        webContent.on("new-window", (e, url) => {
            e.preventDefault();
            shell.openExternal(url);
        });
        webviewsRendered.push(webContentsId);
    }
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
    if (isDev) mainWindow.webContents.openDevTools({mode: "detach"});
    storeMainWindow(mainWindow);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

let isQuiting;

app.on("before-quit", (e) => {
    console.log("before quit");
    isQuiting = true;
});

app.on("quit", function () {
    console.log(
        "quitting app, deleting all the timeouts and intervalls in memory"
    );
    mainWindowQuit();
});

app.whenReady().then(async () => {
    await createWindow();
    createOrUpdateTray();
    updateFrontend();
    windowLoopStart();
    setTimeout(updater, 10000);
    servicesManager.clearSessions();

    getMainWindow().on("close", (e) => {
        if (!isQuiting) {
            e.preventDefault();
            getMainWindow().hide();
            console.log("minimizing app to system tray");
        }
    });

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

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
            return;
        }
        getMainWindow().show();
    });
});

let reminderRef;
let updateFrontendRef;

function windowLoopStart() {
    reminderRef = reminderLoop();

    console.log("update loop start");
    updateFrontendRef = setInterval(async () => {
        try {
            updateFrontend();
            servicesManager.updateUnreadMessages();
        } catch (error) {
        }
    }, 1000);

    windowTrackerLoop();
}

function mainWindowQuit() {
    clearInterval(reminderRef);
    clearInterval(updateFrontendRef);

    const services = servicesManager.getServicesComplete();
    services.forEach((service) => {
        service.endAuthLoop();
        service.endMessagesLoop();
        service.endUnreadLoop();
    });

    storeAppEnd();
    closeAnyOpenInteractionArray();
    storeBreakFocusClicks(true);
}
