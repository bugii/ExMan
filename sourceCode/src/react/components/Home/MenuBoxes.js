import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import TodayIcon from "@material-ui/icons/Today";
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";
import Colors from "../Colors";
import Button from "@material-ui/core/Button";
import EqualizerIcon from "@material-ui/icons/Equalizer";

const { ipcRenderer } = window.require("electron");

export const MenuBoxContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-content: center;
  flex-wrap: wrap;
  align-items: center;
`;

export const MenuBoxDiv = styled.div`
  height: 300px;
  width: 300px;
  margin: 15px;
  background-color: ${Colors.turquoise};
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const MenuIcon = styled.div`
  color: ${Colors.navy};
`;

function MenuBoxes(props) {
  let history = useHistory();

  const [calendarRegistered, setCalendarRegistered] = useState("");

  const openDashboard = () => {
    history.push("/dashboard");
  };

  const handleOutlookCalClick = () => {
    ipcRenderer.send("outlook-cal-register-start");
  };

  const handleGoogleCalClick = () => {
    ipcRenderer.send("google-cal-register-start");
  };

  useEffect(() => {
    ipcRenderer.once("calendar-successfully-added", (e, type) => {
      setCalendarRegistered(type);
    });

    ipcRenderer.once("tokens", (e, tokens) => {
      if (tokens.google) {
        setCalendarRegistered("google");
        ipcRenderer.send("get-all-future-focus-sessions");
      } else if (tokens.microsoft) {
        setCalendarRegistered("microsoft");
        ipcRenderer.send("get-all-future-focus-sessions");
      }
    });
    ipcRenderer.send("tokens");
  }, []);

  return (
    <MenuBoxContainer>
      <MenuBoxDiv onClick={props.handleFocusNow}>
        <MenuIcon>
          <FilterCenterFocusIcon style={{ fontSize: 150 }} />
        </MenuIcon>
        focus now
      </MenuBoxDiv>
      <MenuBoxDiv>
        <MenuIcon>
          <TodayIcon style={{ fontSize: 150 }} />
        </MenuIcon>
        {calendarRegistered ? (
          <div style={{ textAlign: "center" }}>
            You are connected to your {calendarRegistered} calendar, schedule
            events with the subject: "Focus"
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Button onClick={handleOutlookCalClick}>
              Connect to outlook calendar
            </Button>
            <Button onClick={handleGoogleCalClick}>
              Connect to google calendar
            </Button>
          </div>
        )}
      </MenuBoxDiv>
      <MenuBoxDiv onClick={openDashboard}>
        <MenuIcon>
          <EqualizerIcon style={{ fontSize: 150 }} />
        </MenuIcon>
        dashboard
      </MenuBoxDiv>
    </MenuBoxContainer>
  );
}

export default MenuBoxes;
