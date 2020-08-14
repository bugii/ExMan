import React from "react";
import SettingsIcon from "@material-ui/icons/Settings";
import Service from "./Service";
import Colors from "../Colors";
import styled from "styled-components";
import HomeIcon from "@material-ui/icons/Home";
import Tooltip from "@material-ui/core/Tooltip";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

export const NavbarDiv = styled.div`
  width: 100px;
  height: 100vh;
  background-color: ${Colors.navy};
  position: relative;
`;

// to get access to the electron package you could alternatively edit the webpack config
// like mentioned here: https://stackoverflow.com/questions/44008674/how-to-import-the-electron-ipcrenderer-in-a-react-webpack-2-setup
// const electron = window.require("electron");
// const ipcRenderer = electron.ipcRenderer;

function Navbar(props) {
  const handleHomeClick = () => {
    props.setActiveService("home");
  };

  return (
    <NavbarDiv>
      <Tooltip title="home" arrow placement="right">
        <HomeIcon
          onClick={handleHomeClick}
          style={{ color: Colors.snow, fontSize: 50, margin: "0.5rem 1rem" }}
        />
      </Tooltip>
      <div>
        {props.services.map((service) => (
          <Service
            key={service.id}
            id={service.id}
            setActiveService={props.setActiveService}
            name={service.name}
            icon={props.serviceDefaults[service.name].icon}
            deleteApp={props.deleteApp}
          />
        ))}
        <div
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            height: "100%",
          }}
        >
          <Tooltip title="settings" arrow placement="right">
            <SettingsIcon
              style={{
                color: Colors.snow,
                fontSize: 50,
                margin: "0.5rem 1rem",
                position: "absolute",
                top: "90%",
              }}
            />
          </Tooltip>
          <Tooltip title="add app" arrow placement="right">
            <AddCircleOutlineIcon
              onClick={props.openAddingApp}
              style={{
                color: Colors.snow,
                fontSize: 50,
                margin: "0.5rem 1rem",
                position: "absolute",
                top: "80%",
              }}
            />
          </Tooltip>
        </div>
      </div>
    </NavbarDiv>
  );
}

export default Navbar;
