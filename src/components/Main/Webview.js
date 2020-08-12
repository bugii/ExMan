import React, { useRef } from "react";

// With the remote module I am able to get the __dirname from the electron.js file (which is the same as public -> can be used to get preload scripts)
const electron = window.require("electron");
const remote = electron.remote;
const ipcRenderer = electron.ipcRenderer;

function Webview(props) {
  let z = 1;
  if (props.isActive) {
    z = 100;
  }

  const enableDevTools = (el) => {
    if (el) {
      el.addEventListener("dom-ready", () => {
        el.openDevTools();
        // the webcontentsId is stored in the database for easy reference from the main process)
        ipcRenderer.send("webview-rendered", {
          name: props.name,
          webContentsId: el.getWebContentsId(),
        });
      });
    }
  };

  return (
    <div>
      <webview
        style={{ zIndex: z }}
        ref={enableDevTools}
        src={props.url}
        useragent={props.useragent}
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
