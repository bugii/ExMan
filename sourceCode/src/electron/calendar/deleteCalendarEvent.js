const { getTokens } = require("../db/db");
const axios = require("axios");

module.exports = async (id) => {
  const tokens = getTokens();

  if (tokens.google) {
    const configGoogle = {
      method: "delete",
      url: `https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`,
      headers: {
        Authorization: `Bearer ${tokens.google.access_token}`,
      },
    };
    try {
      const responseGoogle = await axios(configGoogle);
      if (responseGoogle.status === 401) {
        console.log("not authed google");
        return;
      }
      console.log("removed event from calendar");
    } catch (error) {
      console.log(error);
    }
  } else if (tokens.microsoft) {
    const configMS = {
      method: "delete",
      url: `https://graph.microsoft.com/v1.0/me/events/${id}`,
      headers: {
        Authorization: `Bearer ${tokens.microsoft.access_token}`,
      },
    };

    try {
      const responseMS = await axios(configMS);
      if (responseMS.status === 401) {
        console.log("not authed microsoft");
        return;
      }
      console.log("removed event from calendar");
    } catch (error) {
      console.log(error);
    }
  }
};
