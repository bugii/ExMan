import React, { useState } from "react";
import Colors from "../Colors";

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
      el.addEventListener("crashed", () => {
        console.log("crashed", props.id);
        el.reload();
      });
      el.addEventListener("did-fail-load", () => {
        // gmail always fires this for some reason...
        if (props.name !== "gmail" && props.name !== "outlook") {
          console.log("failed loading", props.id, props.name);
          el.reload();
        }
      });
    }
  };

  return (
    <div>
      {props.currentFocusSession !== null ? (
        <div
          style={{
            backgroundColor: Colors.turquoise,
            width: "100%",
            textAlign: "center",
            zIndex: "1800",
            position: "fixed",
          }}
        >
          <p style={{ color: "white" }}>Focus</p>
        </div>
      ) : null}
      <webview
        style={{ zIndex: z, backgroundColor: "#FCF7F8" }}
        ref={webviewRef}
        src={props.url}
        useragent={props.useragent}
        partition={`persist:${props.id}`}
        preload={
          !props.isOther
            ? `file://${remote.app.dirname}/preload/${props.name}.js`
            : `file://${remote.app.dirname}/preload/default.js`
        }
      />
    </div>
  );
}

export default Webview;
