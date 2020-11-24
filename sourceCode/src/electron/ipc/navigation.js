const { ipcMain } = require("electron");
const {
  storeServiceInteractionEndInArchive,
  storeServiceInteractionEndInCurrentFocus,
  storeServiceInteractionStartInArchive,
  storeServiceInteractionStartInCurrentFocus,
  checkForInteractionCloseByServiceId,
  storeBreakFocusClicks,
} = require("../db/db");
const { getFocus } = require("../db/memoryDb");

let lastId = null;
let comingFromFocus = false;

ipcMain.on("route-changed", (e, { location }) => {
  const isFocus = getFocus();

  if (comingFromFocus && location.pathname !== "/focus") {
    // if there was a route change away from focus while in focus -> start borkenFocus
    storeBreakFocusClicks(false);
  }

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
    if (lastId !== null) {
      checkForInteractionCloseByServiceId(lastId);
    }
    lastId = null;
  }

  if (location.pathname === "/focus") {
    comingFromFocus = true;
  } else comingFromFocus = false;
});
