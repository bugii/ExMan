import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import TodayIcon from "@material-ui/icons/Today";
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";
import Colors from "../Colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Button from "@material-ui/core/Button";

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
  const [calendarFocusSessions, setCalendarFocusSessions] = useState([]);

  const handleOutlookCalClick = () => {
    ipcRenderer.send("outlook-cal-register-start");
  };

  const handleGoogleCalClick = () => {
    ipcRenderer.send("google-cal-register-start");
  };

  const updateCalendarSessions = (type) => {
    ipcRenderer.send("calendar-focus-sessions-24h", type);
  };

  const cancelFutureSession = (sessionId) => {
    console.log("Cancelling session: ", sessionId);
    ipcRenderer.send("cancel-future-focus-session", sessionId);
  };

  const formatSessionTimes = (start, end) => {
    let date = new Date(start);
    let startTime = new Date();
    let endTime = new Date();
    startTime.setTime(start);
    endTime.setTime(end);
    return (
      date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear() +
      " : " +
      startTime.getHours() +
      ":" +
      ("0" + startTime.getMinutes()).substr(-2) +
      " to " +
      endTime.getHours() +
      ":" +
      ("0" + endTime.getMinutes()).substr(-2)
    );
  };

  useEffect(() => {
    // ipcRenderer.once("calendar-focus-sessions-24h", (e, sessions) => {
    //   setCalendarFocusSessions(sessions);
    // });

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

    ipcRenderer.on("get-all-future-focus-sessions", (e, focusSessions) => {
      setCalendarFocusSessions(focusSessions);
    });

    ipcRenderer.send("tokens");

    ipcRenderer.send("get-all-future-focus-sessions");
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
          <div>
            You are connected to your {calendarRegistered} calendar, schedule
            events with the subject: "Focus"
          </div>
        ) : (
          <div>
            <Button onClick={handleOutlookCalClick}>
              Connect to outlook calendar
            </Button>
            <Button onClick={handleGoogleCalClick}>
              Connect to google calendar
            </Button>
          </div>
        )}
      </MenuBoxDiv>
      <MenuBoxDiv>
        Your next focus sessions (imported from calendar)
        {calendarFocusSessions.map((focusSession) => (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              {formatSessionTimes(focusSession.startTime, focusSession.endTime)}
            </AccordionSummary>
            <AccordionDetails style={{ justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={() => cancelFutureSession(focusSession.id)}
              >
                Cancel Session
              </Button>
            </AccordionDetails>
          </Accordion>
        ))}
      </MenuBoxDiv>
    </MenuBoxContainer>
  );
}

export default MenuBoxes;
