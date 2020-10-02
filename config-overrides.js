const path = require("path");

module.exports = {
  paths: function (paths, env) {
    paths.appIndexJs = path.resolve(__dirname, "sourceCode/src/react/index.js");
    paths.appSrc = path.resolve(__dirname, "sourceCode/src/react");
    paths.appHtml = path.resolve(__dirname, "sourceCode/public/index.html");
    paths.appPublic = path.resolve(__dirname, "sourceCode/public");
    return paths;
  },
};
