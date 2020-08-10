import React from "react";
import "./Navbar.scss";
import Home from "./Home";
import Service from "./Service";

// to get access to the electron package you could alternatively edit the webpack config
// like mentioned here: https://stackoverflow.com/questions/44008674/how-to-import-the-electron-ipcrenderer-in-a-react-webpack-2-setup
// const electron = window.require("electron");
// const ipcRenderer = electron.ipcRenderer;

function Navbar(props) {
  return (
    <div className="navbar">
      <Home setActiveService={props.setActiveService} />
      <div className="services">
        {props.services.map((service) => (
          <Service
            key={service.name}
            setActiveService={props.setActiveService}
            name={service.name}
            icon={props.serviceDefaults[service.name].icon}
          />
        ))}
      </div>
    </div>
  );
}

export default Navbar;
