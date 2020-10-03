const { getMainWindow, storeTimeoutRef } = require("../db/memoryDb");
const bringToFront = require("./bringToFront");

module.exports = () => {
  // method used to schedule a random popup (occurs randomly between 45min and 90min of usage)
  const timeUntilPopup = randomIntFromInterval(45, 90);
  console.log("next random popup in ", timeUntilPopup, "minutes");

  const ref = setTimeout(() => {
    getMainWindow().send("random-popup-survey");
    bringToFront();
  }, timeUntilPopup * 60 * 1000);
  storeTimeoutRef(ref);
};

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
