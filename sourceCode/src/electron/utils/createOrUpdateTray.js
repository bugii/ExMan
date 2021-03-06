const { getSettings } = require("../db/db");
const { Tray, nativeImage, Menu } = require("electron");
const path = require("path");
const focusStart = require("./focusStart");
const focusEnd = require("./focusEnd");
const { getFocus, getMainWindow } = require("../db/memoryDb");

let tray = null;

module.exports = createOrUpdateTray = () => {
  if (!tray) {
    // Create tray if not already existing
    const trayImage = nativeImage
      .createFromPath(path.join(__dirname, "../assets/icon.png"))
      .resize({ width: 16, height: 16 });
    tray = new Tray(trayImage);
  }

  let contextMenu;

  if (!getFocus()) {
    contextMenu = Menu.buildFromTemplate([
      {
        label: "Start open focus",
        click: () => {
          const start = new Date().getTime();
          focusStart(start);
        },
      },
      {
        label: "Start short focus",
        click: () => {
          const start = new Date().getTime();
          const settings = getSettings();
          focusStart(start, start + settings.shortFocusDuration * 60 * 1000);
        },
      },
      {
        label: "Start medium focus",
        click: () => {
          const start = new Date().getTime();
          const settings = getSettings();
          focusStart(start, start + settings.mediumFocusDuration * 60 * 1000);
        },
      },
      {
        label: "Start long focus",
        click: () => {
          const start = new Date().getTime();
          const settings = getSettings();
          focusStart(start, start + settings.longFocusDuration * 60 * 1000);
        },
      },
      { type: "separator" },
      { role: "hide" },
      {
        label: "Open exman",
        click: () => {
          getMainWindow().show();
        },
      },
      { role: "front" },
      { type: "separator" },
      { role: "quit" },
    ]);
  } else {
    contextMenu = Menu.buildFromTemplate([
      {
        label: "End focus",
        click: () => {
          focusEnd();
        },
      },
      { type: "separator" },
      { role: "hide" },
      {
        label: "Open exman",
        click: () => {
          getMainWindow().show();
        },
      },
      { role: "front" },
      { type: "separator" },
      { role: "quit" },
    ]);
  }

  tray.setContextMenu(contextMenu);
};
