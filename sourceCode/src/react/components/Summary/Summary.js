import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Colors from "../Colors";
import PostFocusPopup from "../Focus/Popups/PostFocusPopup";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import BarChart from "./BarChart";
import DonutChart from "./DonutChart";
import ServiceMessageSummaryBox from "./ServiceMessageSummaryBox";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const SummaryDiv = styled.div`
  padding: 2rem;
  position: absolute;
  z-index: 1;
  height: 100vh;
  overflow: scroll;
  width: 100%;
  background: ${Colors.snow};
  display: flex;
  flex-direction: column;
  text-align: center;
`;

export const ChartsDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  margin: 25px;
`;

export const Services = styled.div`
  background-color: ${Colors.turquoise};
  margin: 10px;
  width: 80%;
  text-align: center;
  border: solid black;
  padding: 10px;
  margin-bottom: 30px;
  border-radius: 5px;
`;

function Summary(props) {
  const [showPostFocusPopup, setshowPostFocusPopup] = useState(true);
  const [focusSession, setFocusSession] = useState(null);

  let history = useHistory();

  const handleClose = () => {
    history.push("/");
  };

  useEffect(() => {
    ipcRenderer.on("get-previous-focus-session", (e, focusSession) => {
      setFocusSession(focusSession);
    });
    // on mounted -> get the last focus session (the one that just finished) and display a summary
    ipcRenderer.send("get-previous-focus-session");
  }, []);

  return (
    <SummaryDiv>
      {showPostFocusPopup && focusSession ? (
        <PostFocusPopup
          goals={focusSession.goals ? focusSession.goals : []}
          completedGoals={focusSession.completedGoals ? focusSession.completedGoals : []}
          open={showPostFocusPopup}
          close={() => setshowPostFocusPopup(false)}
        />
      ) : null}

      <div style={{ position: "absolute", top: 15, right: 15 }}>
        <IconButton onClick={handleClose}>
          <CloseIcon fontSize="large" />
        </IconButton>
      </div>

      <h1 style={{ color: Colors.navy }}>SUMMARY</h1>

      {focusSession ? (
        <div>
          <p>
            from {props.formatTime(focusSession.startTime)} to{" "}
            {props.formatTime(focusSession.endTime)}
          </p>
          <ChartsDiv>
            <div style={{width: "50%"}}>
              <h3>Notification Summary</h3>
              <ServiceMessageSummaryBox
                  formatTime={props.formatTime}
                  focusSession={focusSession}
                  offeredServices={props.offeredServices}
                  setActiveService={props.setActiveService}
                  backgroundColor={"white"}
                  charLimit={120}
              />
              <h3>Bar Chart</h3>
              <BarChart data={focusSession} />
            </div>
            <div style={{width: "50%"}}>
              <DonutChart data={focusSession} />
            </div>
          </ChartsDiv>
        </div>
      ) : null}
    </SummaryDiv>
  );
}

export default Summary;
