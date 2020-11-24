const axios = require("axios");
const { getTokens } = require("../db/db");

module.exports = async (type) => {
  const timeMin = new Date();
  let timeMax = new Date(timeMin);
  timeMax.setDate(timeMax.getDate() + 1);

  // console.log("UTC time string", timeMin.toISOString(), timeMax.toISOString());

  const tokens = getTokens();

  switch (type) {
    case "google":
      const configGoogle = {
        method: "get",
        url: `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMax=${timeMax.toISOString()}&timeMin=${timeMin.toISOString()}&q=Focus&singleEvents=true&timeZone=UTC`,
        headers: {
          Authorization: `Bearer ${tokens.google.access_token}`,
        },
      };
      try {
        const responseGoogle = await axios(configGoogle);
        if (responseGoogle.status === 401) {
          console.log("not authed google");
          return [];
        }
        let items = responseGoogle.data.items;
        items = items.map((event) => ({
          start: Date.parse(event.start.dateTime),
          end: Date.parse(event.end.dateTime),
          id: event.id,
        }));
        return items;
      } catch (error) {
        console.log(error);
        return [];
      }

    case "microsoft":
      const configMS = {
        method: "get",
        url: `https://graph.microsoft.com/v1.0/me/calendar/calendarView?startDateTime=${timeMin.toISOString()}&endDateTime=${timeMax.toISOString()}&$filter=contains(subject,\'Focus\')`,
        headers: {
          Authorization: `Bearer ${tokens.microsoft.access_token}`,
        },
      };

      try {
        const responseMS = await axios(configMS);
        if (responseMS.status === 401) {
          console.log("not authed microsoft");
          return [];
        }
        let items = responseMS.data.value;
        items = items.map((event) => ({
          start: Date.parse(event.start.dateTime + "Z"),
          end: Date.parse(event.end.dateTime + "Z"),
          id: event.id,
        }));
        return items;
      } catch (error) {
        console.log(error);
        return [];
      }
    default:
      return [];
  }
};
