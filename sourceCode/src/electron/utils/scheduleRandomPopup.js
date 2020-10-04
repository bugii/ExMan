const { getMainWindow, storeTimeoutRef, getFocus } = require("../db/memoryDb");
const bringToFront = require("./bringToFront");

// method used to schedule a random popup (occurs randomly between 45min and 90min of usage)
module.exports = scheduleRandomPopup = () => {
  const timeUntilPopup = randomIntFromInterval(45, 90);
  console.log("next random popup in ", timeUntilPopup, "minutes");

  const ref = setTimeout(() => {
    // only open popup if not in focus at that time
    if (!getFocus()) {
      getMainWindow().send("random-popup-survey");
      bringToFront();
    } else {
      // don't show popup if in focus, but reschedule the popup
      console.log("rescheduling random popup because currently in focus");
      scheduleRandomPopup();
    }
  }, timeUntilPopup * 60 * 1000);
  storeTimeoutRef(ref);
};

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
