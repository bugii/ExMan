const { session, webContents } = require("electron");
const axios = require("axios");

const setDnd = (webContentsId) => {};

const setOnline = (webContentsId) => {};

const getMessages = (webContentsId, timestamp) => {};

const sendMessage = (webContentsId, channel, message) => {};

const getUnreadChats = async (webContentsId) => {
  const unreadChats = await webContents
    .fromId(webContentsId)
    .executeJavaScript("window.getUnreadChats()");
  return unreadChats;
};

const getAuthStatus = (webContentsId) => {
  return true;
};

module.exports = {
  setDnd,
  setOnline,
  getMessages,
  sendMessage,
  getUnreadChats,
  getAuthStatus,
};
