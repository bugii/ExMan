const { getCurrentFocusSession } = require("../db/db");
const { getMainWindow } = require("../db/memoryDb");
const servicesManager = require("../services/ServicesManger");

module.exports = () => {
  const services = servicesManager.getServices();
  const currentFocusSession = getCurrentFocusSession();
  getMainWindow().send("update-frontend", { services, currentFocusSession });
};
