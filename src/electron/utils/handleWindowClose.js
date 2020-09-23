const servicesManager = require("../services/ServicesManger");
const { getTimeoutRefs } = require("../db/memoryDb");

module.exports = () => {
  // Remove the 'global' timeouts / intervalls (the ones that )
  getTimeoutRefs().forEach((ref) => {
    clearTimeout(ref);
  });

  // Remove all the intervals for each of the services (message loop, auth loop and unread loop)
  servicesManager.getServicesComplete().forEach((service) => {
    service.intervallRefs.forEach((ref) => {
      clearInterval(ref);
    });
  });
};
