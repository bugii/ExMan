import React from "react";
import "./Focus.scss";
const electron = window.require("electron");
const remote = electron.remote;
const ipcRenderer = electron.ipcRenderer;

function Focus(props) {
  const escapeFocus = () => {
    // send ipc message to main process to start session there too (db etc)
    ipcRenderer.send("focus-end");
    // adjust UI too
    props.setFocus(false);
  };

  return (
    <div className="focus">
      <div>Currently in Focus</div>
      <button onClick={escapeFocus}> Escape focus</button>
    </div>
  );
}

export default Focus;
