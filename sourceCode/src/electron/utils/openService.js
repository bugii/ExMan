const { getMainWindow } = require("../db/memoryDb");

module.exports = (id) => {
  // If a new notification comes in, open the corresponding service in the frontend
  getMainWindow().webContents.send("open-service", id);
};
