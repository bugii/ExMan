import React, {
  //useEffect,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import SettingsIcon from "@material-ui/icons/Settings";
import Service from "./Service";
import Colors from "../Colors";
import styled from "styled-components";
import HomeIcon from "@material-ui/icons/Home";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";
import NewFocusSession from "../Focus/NewFocusSession";
//import {HomeDiv} from "../Home/Home";

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
//const electron = window.require("electron");
//const ipcRenderer = electron.ipcRenderer;

function Navbar(props) {
  let history = useHistory();
  const [focusDialogOpen, setFocusDialogOpen] = useState(false);

  /* Save in case we want to one-click open session
    const startFocus = (focusDuration) => {
        const start = new Date().getTime();
        let end;
        if (!focusDuration) {
            // open ended
            end = null;
        } else {
            end = start + focusDuration * 1000 * 60;
        }
        console.log(start, end);
        ipcRenderer.send("focus-start-request", {
            startTime: start,
            endTime: null,
        });
    };
    */

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
              showBubble={true}
            />
          ))}
        </div>
      </div>

      <div>
        <FilterCenterFocusIcon
          onClick={() => setFocusDialogOpen(true)}
          style={{
            color: Colors.snow,
            fontSize: 50,
            margin: "0.5rem 1rem",
          }}
        />
        <NewFocusSession
          open={focusDialogOpen}
          closeDialog={() => setFocusDialogOpen(false)}
        />

        {!props.currentFocusSession ? (
          <AddCircleOutlineIcon
            onClick={() => history.push("/add-service")}
            style={{
              color: Colors.snow,
              fontSize: 50,
              margin: "0.5rem 1rem",
            }}
          />
        ) : null}

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
