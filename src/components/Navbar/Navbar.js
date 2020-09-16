import React from "react";
import { useHistory } from "react-router-dom";
import SettingsIcon from "@material-ui/icons/Settings";
import Service from "./Service";
import Colors from "../Colors";
import styled from "styled-components";
import HomeIcon from "@material-ui/icons/Home";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import EqualizerIcon from "@material-ui/icons/Equalizer";

export const NavbarDiv = styled.div`
  width: 100px;
  height: 100vh;
  background-color: ${Colors.navy};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

// to get access to the electron package you could alternatively edit the webpack config
// like mentioned here: https://stackoverflow.com/questions/44008674/how-to-import-the-electron-ipcrenderer-in-a-react-webpack-2-setup
// const electron = window.require("electron");
// const ipcRenderer = electron.ipcRenderer;

function Navbar(props) {
  let history = useHistory();

  return (
    <NavbarDiv>
      <div>
        <HomeIcon
          onClick={() => history.push("/")}
          style={{ color: Colors.snow, fontSize: 50, margin: "0.5rem 1rem" }}
        />
        <div>
          {props.services.map((service) => (
            <Service
              key={service.id}
              id={service.id}
              setActiveService={props.setActiveService}
              name={service.name}
              unreadCount={service.unreadCount}
              isReady={service.ready}
              isAuthed={service.authed}
              icon={props.offeredServices[service.name].icon}
              deleteApp={props.deleteApp}
              currentFocusSession={props.currentFocusSession}
              webContentsId={service.webContentsId}
              refreshApp={props.refreshApp}
            />
          ))}
        </div>
      </div>

      <div>
        <AddCircleOutlineIcon
          onClick={() => history.push("/add-service")}
          style={{
            color: Colors.snow,
            fontSize: 50,
            margin: "0.5rem 1rem",
          }}
        />
        <EqualizerIcon
          onClick={() => history.push("/dashboard")}
          style={{
            color: Colors.snow,
            fontSize: 50,
            margin: "0.5rem 1rem",
          }}
        />
        <SettingsIcon
          onClick={() => history.push("/settings")}
          style={{
            color: Colors.snow,
            fontSize: 50,
            margin: "0.5rem 1rem",
          }}
        />
      </div>
    </NavbarDiv>
  );
}

export default Navbar;
