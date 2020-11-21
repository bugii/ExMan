const { ipcMain } = require("electron");
const {
  storeServiceInteractionEndInArchive,
  storeServiceInteractionEndInCurrentFocus,
  storeServiceInteractionStartInArchive,
  storeServiceInteractionStartInCurrentFocus,
} = require("../db/db");
const { getFocus } = require("../db/memoryDb");

let lastId = null;

ipcMain.on("route-changed", (e, { location, isFocus }) => {
  if (location.pathname.includes("/services")) {
    // navigated to service route
    const splitArray = location.pathname.split("/");
    const id = splitArray[splitArray.length - 1];
    if (isFocus) {
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
    if (isFocus) {
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
