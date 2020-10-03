import React, { useState } from "react";

// With the remote module I am able to get the __dirname from the electron.js file (which is the same as public -> can be used to get preload scripts)
const electron = window.require("electron");
const remote = electron.remote;
const ipcRenderer = electron.ipcRenderer;

function Webview(props) {
  let z = -1;
  if (props.isActive) {
    z = 0;
  }

  const [registered, setregistered] = useState(false);

  const webviewRef = (el) => {
    if (el && !registered) {
      setregistered(true);
      el.addEventListener("dom-ready", () => {
        // the webcontentsId is stored in the database for easy reference from the main process
        ipcRenderer.send("webview-rendered", {
          id: props.id,
          webContentsId: el.getWebContentsId(),
        });
      });
      el.addEventListener("did-fail-load", () => {
        console.log("failed loading", props.id);
        el.reload();
      });
      el.addEventListener("crashed", () => {
        console.log("crashed", props.id);
        el.reload();
      });
    }
  };

  return (
    <div>
      <webview
        style={{ zIndex: z, backgroundColor: "#FCF7F8" }}
        ref={webviewRef}
        src={props.url}
        useragent={props.useragent}
        partition={`persist:${props.id}`}
        allowpopups="true"
        disablewebsecurity="true"
        preload={`file://${remote.app.dirname}/preload/${props.name}.js`}
        webpreferences="allowRemoteContent"
      />
    </div>
  );
}

export default Webview;
