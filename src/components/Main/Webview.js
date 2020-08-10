import React, { useRef } from "react";

// With the remote module I am able to get the __dirname from the electron.js file (which is the same as public -> can be used to get preload scripts)
const electron = window.require("electron");
const remote = electron.remote;
const ipcRenderer = electron.ipcRenderer;

function Webview(props) {
  let webview = null;

  let z = 1;
  if (props.isActive) {
    z = 100;
  }

  // const sendMessage = () => {
  //   const token = getToken();
  //   ipcRenderer.send("sendSlackMessage", token);
  // };

  // const getToken = () => {
  //   if (props.name === "Slack") {
  //     webview.executeJavaScript(
  //       'var security_objects = JSON.parse(localStorage.getItem("localConfig_v2"))["teams"]; var token = security_objects[Object.keys(security_objects)[0]].token; console.log(token); var conversationId = window.location.href.substring(41, 52); console.log(conversationId);'
  //     );
  //   }
  // };

  return (
    <div>
      <webview
        style={{ zIndex: z }}
        ref={(el) => {
          if (!webview) {
            console.log(el);
            webview = el;
            el.addEventListener("dom-ready", () => {
              webview.openDevTools();
              console.log(el.getWebContentsId());
            });
          }
        }}
        src={props.url}
        useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:79.0) Gecko/20100101 Firefox/79.0"
        preload={
          process.env.NODE_ENV === "development"
            ? `file://${remote.app.dirname}/preload/${props.name}.js`
            : `${process.env.PUBLIC_URL}/preload/${props.name}.js`
        }
        webpreferences="allowRemoteContent"
      ></webview>
    </div>
  );
}

export default Webview;
