const servicesManager = require("../services/ServicesManger");
const {
  getTimeoutRefs,
  getIntervallRefs,
  getFocusEndRef,
} = require("../db/memoryDb");
const { storeAppEnd } = require("../db/db");

module.exports = () => {
  // Remove the 'global' timeouts / intervalls
  getTimeoutRefs().forEach((ref) => {
    clearTimeout(ref);
  });
  clearTimeout(getFocusEndRef());
  getIntervallRefs().forEach((ref) => {
    clearInterval(ref);
  });

  // Remove all the intervals for each of the services (message loop, auth loop and unread loop)
  servicesManager.getServicesComplete().forEach((service) => {
    service.endAuthLoop();
    service.endUnreadLoop();
    service.endMessagesLoop();
  });

  storeAppEnd();
};
