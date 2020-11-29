const axios = require("axios");
const { getTokens, storeCalendarEmail } = require("../db/db");

module.exports = {
  getAndStoreCalendarEmail: async () => {
    const tokens = getTokens();

    if (tokens.google) {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/calendar/v3/calendars/primary",
          {
            headers: {
              Authorization: `Bearer ${tokens.google.access_token}`,
            },
          }
        );
        storeCalendarEmail("google", res.data.summary);
        return res.data.summary;
      } catch (e) {
        console.log(e);
      }
    } else if (tokens.microsoft) {
      try {
        const res = await axios.get(
          "https://graph.microsoft.com/v1.0/me/calendar",
          {
            headers: {
              Authorization: `Bearer ${tokens.microsoft.access_token}`,
            },
          }
        );
        storeCalendarEmail("outlook", res.data.owner.address);
        return res.data.owner.address;
      } catch (e) {
        console.log(e);
      }
    }
  },
};
