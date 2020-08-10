import React from "react";
import "./Navbar.scss";
import Services from "./Services";

// to get access to the electron package you could alternatively edit the webpack config
// like mentioned here: https://stackoverflow.com/questions/44008674/how-to-import-the-electron-ipcrenderer-in-a-react-webpack-2-setup
// const electron = window.require("electron");
// const ipcRenderer = electron.ipcRenderer;

function Navbar(props) {
  return (
    <div className="navbar">
      <Services setActiveService={props.setActiveService} />
    </div>
  );
}

export default Navbar;
