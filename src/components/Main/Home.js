import React from "react";
import "./Home.scss";
const electron = window.require("electron");
const remote = electron.remote;
const ipcRenderer = electron.ipcRenderer;

function Home(props) {
  // Even if no service is selected (they have z-index: 1) by default, make sure to be on top
  let z = 2;
  if (props.isActive) {
    z = 100;
  }

  const focusOnClick = () => {
    // send ipc message to main process to start session there too (db etc)
    ipcRenderer.send("focus-start", { minutes: 60 });
    // adjust UI too
    props.setFocus(true);
  };

  return (
    <div className="home" style={{ zIndex: z }}>
      <p> Currently added {props.nrOfServices} service/s </p>
      <button onClick={focusOnClick}>Focus now for 5 minutes</button>
    </div>
  );
}

export default Home;
