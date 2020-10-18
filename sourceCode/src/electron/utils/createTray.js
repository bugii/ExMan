const { getSettings } = require("../db/db");
const { Tray, nativeImage, Menu } = require("electron");
const path = require("path");
const focusStart = require("./focusStart");

let tray = null;

module.exports = () => {
  const trayImage = nativeImage
    .createFromPath(path.join(__dirname, "../assets/icon.png"))
    .resize({ width: 16, height: 16 });
  tray = new Tray(trayImage);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Start short focus session",
      click: () => {
        const start = new Date().getTime();
        const settings = getSettings();
        focusStart(start, start + settings.shortFocusDuration * 60 * 1000);
      },
    },
    {
      label: "Start medium focus session",
      click: () => {
        const start = new Date().getTime();
        const settings = getSettings();
        focusStart(start, start + settings.mediumFocusDuration * 60 * 1000);
      },
    },
    {
      label: "Start long focus session",
      click: () => {
        const start = new Date().getTime();
        const settings = getSettings();
        focusStart(start, start + settings.longFocusDuration * 60 * 1000);
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
};
