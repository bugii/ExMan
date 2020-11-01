const { ipcMain } = require("electron");
const { getTokens } = require("../db/db");

ipcMain.on("tokens", (e) => {
  e.reply("tokens", getTokens());
});
