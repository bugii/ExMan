const activeWin = require("active-win");
const {
  storeActiveWindowInArchive,
  storeActiveWindowInCurrentFocus,
  getSettings,
} = require("../db/db");
const {
  storeIntervallRef,
  getFocus,
  getMainWindow,
} = require("../db/memoryDb");

let lastReminded;

module.exports = () => {
  const windowTrackerIntervall = setInterval(async () => {
    const activeWindow = await activeWin();
    const currentTime = new Date().getTime();
    if (activeWindow) {
      const isDistraction = checkForDistractingApps(
        activeWindow.title,
        activeWindow.url
      );

      if (getFocus()) {
        if (isDistraction && getSettings().appVersion === "exman") {
          // Discourage the user from continuing on this website by showing him a notification
          if (!lastReminded || lastReminded + 10 * 60000 < currentTime) {
            getMainWindow().send("distraction-notification");
            lastReminded = currentTime;
          }
        }

        storeActiveWindowInCurrentFocus({
          name: activeWindow.owner.name,
          title: activeWindow.title,
          isDistraction,
        });
      } else {
        storeActiveWindowInArchive({
          name: activeWindow.owner.name,
          title: activeWindow.title,
          isDistraction,
        });
      }
    }
  }, 10000);
  storeIntervallRef(windowTrackerIntervall);
};

const distractingWebsites = [
  "youtube.com",
  "netflix.com",
  "facebook.com",
  "twitter.com",
  "pinterest.com",
  "tumblr.com",
  "instagram.com",
  "flickr.com",
  "meetup.com",
  "ask.fm",
  "hulu.com",
  "imgur.com",
  "vimeo.com",
  "ted.com",
  "blogger.com",
  "imdb.com",
  "deviantart.com",
  "break.com",
  "collegehumor.com",
  "funnyordie.com",
  "liveleak.com",
  "twitch.tv",
  "theonion.com",
  "cracked.com",
  "tmz.com",
  "vice.com",
  "rottentomatoes.com",
  "ebay.com",
  "craigslist.org",
  "etsy.com",
  "ricardo.ch",
  "tutti.ch",
  "bbc.com",
  "forbes.com",
  "economist.com",
  "nbcnews.com",
  "cnn.com",
  "foxnews.com",
  "msnbc.com",
  "huffingtonpost.com",
  "businessinsider.com",
  "buzzfeed.com",
  "yahoo.com",
  "nytimes.com",
  "bloomberg.com",
  "usatoday.com",
  "washingtonpost.com",
  "theguardian.com",
  "npr.org",
  "wsj.com",
  "time.com",
  "news.google.com",
  "cnet.com",
  "cnbc.com",
  "reddit.com",
  "nzz.ch",
  "zalando.ch",
  "web.whatsapp.com",
  "teams.microsoft.com",
  "slack.com",
  "telegram.com",
  "20min.ch",
  "blick.ch",
  "amazon.com",
  "amazon.de",
  "aboutyou.ch",
  "asos.com",
  "na-kd.com",
  "tiktok.com",
  "skype.com",
];

const distractingApps = [
  "netflix",
  "teams",
  "slack",
  "skype",
  "youtube",
  "facebook",
  "twitter",
  "pinterest",
  "tumblr",
  "instagram",
  "flickr",
  "meetup",
  "ask.fm",
  "hulu",
  "imgur",
  "vimeo",
  "ted",
  "blogger",
  "imdb",
  "deviantart",
  "break",
  "collegehumor",
  "funnyordie",
  "liveleak",
  "twitch.tv",
  "theonion",
  "cracked",
  "tmz",
  "vice",
  "rottentomatoes",
  "ebay",
  "craigslist",
  "etsy",
  "ricardo",
  "tutti",
  "bbc",
  "forbes",
  "economist",
  "nbcnews",
  "cnn",
  "foxnews",
  "msnbc",
  "huffingtonpost",
  "businessinsider",
  "buzzfeed",
  "yahoo",
  "nytimes",
  "bloomberg",
  "usatoday",
  "washingtonpost",
  "theguardian",
  "npr.org",
  "wsj",
  "time",
  "news.google",
  "cnet",
  "cnbc",
  "reddit",
  "nzz",
  "zalando",
  "whatsapp",
  "microsoft teams",
  "slack",
  "telegram",
  "20min",
  "blick",
  "amazon",
  "aboutyou",
  "asos",
  "na-kd",
  "tiktok",
  "skype",
];

const checkForDistractingApps = (title, url) => {
  //console.log("title", title, "url", url);
  const lowerCaseTitle = title.toLowerCase();

  if (url) {
    // Is browser, check url
    for (const distractingWebsite of distractingWebsites) {
      if (url.includes(distractingWebsite)) {
        return true;
      }
    }
    return false;
  } else {
    // no url, handle distracting applications/websites via title property
    for (const distractingApp of distractingApps) {
      if (lowerCaseTitle.includes(distractingApp)) {
        return true;
      }
    }
    return false;
  }
};
