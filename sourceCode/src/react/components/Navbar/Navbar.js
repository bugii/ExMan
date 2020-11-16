import React, { useState } from "react";
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
import Drawer from "@material-ui/core/Drawer";
//import List from "@material-ui/core/List";
//import ListItem from "@material-ui/core/ListItem";

export const NavbarDiv = styled.div`
  width: 100px;
  background-color: ${Colors.navy};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

function Navbar(props) {
  let history = useHistory();
  const [focusDialogOpen, setFocusDialogOpen] = useState(false);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      style={{
        width: 100,
        backgroundColor: Colors.navy,
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <HomeIcon
          onClick={() => history.push("/")}
          style={{ color: Colors.snow, fontSize: 50, margin: "0.5rem 1rem" }}
        />
        {props.services.map((service) => {
          if (!service.isOther) {
            return (
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
            );
          } else {
            return (
              <Service
                key={service.id}
                id={service.id}
                setActiveService={props.setActiveService}
                name={service.name}
                unreadCount={service.unreadCount}
                isReady={service.ready}
                isAuthed={service.authed}
                icon={`http://icons.duckduckgo.com/ip2/${service.url
                  .replace("https://", "")
                  .replace("www.", "")}.ico`}
                deleteApp={props.deleteApp}
                currentFocusSession={props.currentFocusSession}
                webContentsId={service.webContentsId}
                refreshApp={props.refreshApp}
                showBubble={true}
              />
            );
          }
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
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
    </Drawer>
  );
}

export default Navbar;
