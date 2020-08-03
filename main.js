// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, BrowserView, shell } = require("electron");
const path = require("path");

let mainWindow;

let whatsappView;
let slackView;
let msTeamsView;
let homeView;

ipcMain.on("set-dnd", (e) => {
  msTeamsView.webContents.executeJavaScript("window.setDoNotDisturb()");
  slackView.webContents.executeJavaScript("window.setDoNotDisturb()");
});

ipcMain.on("app-change", (e, args) => {
  const name = args;

  // By first removing the BrowserView and then adding it again we can make sure that it now sits on top
  // Optimal solution would be to have a z-index, but currently not available on BrowserView: https://github.com/electron/electron/issues/15899
  // Alternative would be to use <webview>, but it is not recommended
  switch (name) {
    case "home":
      console.log("Opening home");
      mainWindow.removeBrowserView(homeView);
      mainWindow.addBrowserView(homeView);
      break;
    case "whatsapp":
      console.log("Opening whatsapp");
      mainWindow.removeBrowserView(whatsappView);
      mainWindow.addBrowserView(whatsappView);
      break;

    case "slack":
      console.log("Opening slack");
      mainWindow.removeBrowserView(slackView);
      mainWindow.addBrowserView(slackView);
      break;

    case "teams":
      console.log("Opening teams");
      mainWindow.removeBrowserView(msTeamsView);
      mainWindow.addBrowserView(msTeamsView);
      break;

    default:
      break;
  }
});

function createWindow() {
  // Main Browser Window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile(path.join(__dirname + "/views/index/index.html"));
  mainWindow.webContents.openDevTools({ mode: "detach" });

  // Views
  // Whatsapp
  whatsappView = new BrowserView({
    webPreferences: { preload: path.join(__dirname, "preload/whatsapp.js") },
  });
  mainWindow.addBrowserView(whatsappView);
  if(process.platform == 'darwin'){
    whatsappView.setBounds({ x: 200, y: 0, width: 1000, height: 800 });
  }
  else{
    whatsappView.setBounds({ x: 200, y: 0, width: 1000, height: 750 });
  }
  whatsappView.webContents.loadURL("https://web.whatsapp.com/", {
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:79.0) Gecko/20100101 Firefox/79.0",
  });
  whatsappView.setAutoResize({
    width: true,
    height: true,
  });
  whatsappView.webContents.on("new-window", (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });

  // Slack
  slackView = new BrowserView({
    webPreferences: { preload: path.join(__dirname, "preload/slack.js") },
  });
  mainWindow.addBrowserView(slackView);
  if(process.platform == 'darwin'){
    slackView.setBounds({ x: 200, y: 0, width: 1000, height: 800 });
  }
  else{
    slackView.setBounds({ x: 200, y: 0, width: 1000, height: 750 });
  }
  //slackView.setBackgroundColor('#ffffff');
  slackView.webContents.loadURL("https://app.slack.com/client/", {
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:79.0) Gecko/20100101 Firefox/79.0",
  });
  slackView.setAutoResize({
    width: true,
    height: true,
  });
  slackView.webContents.on("new-window", (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });



  // Microsoft Teams
  msTeamsView = new BrowserView({
    webPreferences: { preload: path.join(__dirname, "preload/teams.js") },
  });
  mainWindow.addBrowserView(msTeamsView);
  if(process.platform == 'darwin'){
    msTeamsView.setBounds({ x: 200, y: 0, width: 1000, height: 800 });
  }
  else{
    msTeamsView.setBounds({ x: 200, y: 0, width: 1000, height: 750 });
  }
  msTeamsView.webContents.loadURL("https://teams.microsoft.com/", {
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:79.0) Gecko/20100101 Firefox/79.0",
  });
  msTeamsView.setAutoResize({
    width: true,
    height: true,
  });
  msTeamsView.webContents.on("new-window", (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });

  // Blank default view (initially on top)
  homeView = new BrowserView({
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.addBrowserView(homeView);
  homeView.setBounds({ x: 200, y: 0, width: 1000, height: 800 });
  homeView.setAutoResize({
    width: true,
    height: true,
  });
  homeView.webContents.loadFile(path.join(__dirname + "/views/home/home.html"));
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

// send message for teams
function teamsMessage(message){
  var a = document.getElementById('cke_1_contents')
  var b = a.children[0]
  var c = b.children
  c[0].innerText = message
  document.getElementById("send-message-button").click()
}

