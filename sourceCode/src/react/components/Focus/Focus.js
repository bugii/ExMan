import React, { useState } from "react";
import styled from "styled-components";
import Colors from "../Colors";
import Countdown from "./Countdown";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Tooltip from "@material-ui/core/Tooltip";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import ListAltIcon from "@material-ui/icons/ListAlt";
import FocusGoalsPopup from "./Popups/FocusGoalsPopup";
import BreakFocusPopup from "./Popups/BreakFocusPopup";
import { useHistory } from "react-router-dom";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const FocusDiv = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1500;
  height: 100vh;
  width: 100vw;
  background: ${Colors.turquoise};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FocusText = styled.p`
  color: ${Colors.navy};
  font-size: 30px;
  text-align: center;
`;

const FocusMenuButtons = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const IncreaseTimeButton = styled.div`
  background: ${Colors.navy};
  color: white;
  margin-top: 10px;
  padding: 20px;
  font-weight: 5px;
  margin: 15px;
  border: 4px solid white;
`;

const IncreaseDiv = styled.div`
  display: inherit;
  margin-top: 15px;
`;

function Focus(props) {
  const history = useHistory();

  const [showFocusGoalsPopup, setShowFocusGoalsPopup] = useState(
    props.currentFocusSession.goals.length <= 0
  );

  const [showBreakFocusPopup, setShowBreakFocusPopup] = useState(false);

  const escapeFocus = () => {
    // send ipc message to main process to start session there too (db etc)
    ipcRenderer.send("focus-end-request");
  };

  const focusTime = props.currentFocusSession.endTime
    ? Math.ceil((props.currentFocusSession.endTime - new Date()) / 1000 / 60)
    : -1;

  const handleIncreaseEndTimeClick = (minutes) => {
    ipcRenderer.send("focus-end-change-request", minutes);
  };

  const handleFocusChange = () => {
    console.log(props.currentFocusSession.appVersion);
    if (props.currentFocusSession.appVersion === "exman") {
      setShowBreakFocusPopup(true);
    } else {
      history.push("/");
    }
  };

  return (
    <FocusDiv>
      <FocusGoalsPopup
        open={showFocusGoalsPopup}
        goals={props.currentFocusSession.goals}
        calendarSubject={props.currentFocusSession.calendarSubject}
        completedGoals={props.currentFocusSession.completedGoals}
        close={() => setShowFocusGoalsPopup(false)}
      />
      <BreakFocusPopup
        close={() => setShowBreakFocusPopup(false)}
        open={showBreakFocusPopup}
      />

      <h1
        style={{
          color: Colors.navy,
          fontSize: 75,
          textAlign: "center",
          marginBlockEnd: "15px",
        }}
      >
        STAY FOCUSED!
      </h1>
      <Countdown
        focusLength={focusTime}
        isOpen={!props.currentFocusSession.endTime}
      />
      <IncreaseDiv>
        {props.currentFocusSession.endTime ? (
          <IncreaseTimeButton onClick={() => handleIncreaseEndTimeClick(10)}>
            <div>increase 10 min</div>
          </IncreaseTimeButton>
        ) : null}
        {props.currentFocusSession.endTime ? (
          <IncreaseTimeButton onClick={() => handleIncreaseEndTimeClick(15)}>
            <div>increase 15 min</div>
          </IncreaseTimeButton>
        ) : null}
      </IncreaseDiv>
      {props.currentFocusSession.appVersion === "exman" ? (
        <FocusText>We are taking care of your notifications for you.</FocusText>
      ) : null}
      <FocusMenuButtons>
        <Tooltip title="End focus session" arrow placement="top">
          <HighlightOffIcon
            onClick={escapeFocus}
            style={{ color: Colors.snow, fontSize: 80, margin: "2rem" }}
          />
        </Tooltip>
        <Tooltip title="Edit Goals" arrow placement="top">
          <ListAltIcon
            onClick={() => setShowFocusGoalsPopup(true)}
            style={{ color: Colors.snow, fontSize: 80, margin: "2rem" }}
          />
        </Tooltip>
        <Tooltip title="Break focus to see chat" arrow placement="top">
          <QuestionAnswerIcon
            onClick={handleFocusChange}
            style={{ color: Colors.snow, fontSize: 80, margin: "2rem" }}
          />
        </Tooltip>
      </FocusMenuButtons>
    </FocusDiv>
  );
}

export default Focus;
