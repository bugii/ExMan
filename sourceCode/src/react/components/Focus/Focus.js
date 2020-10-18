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

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const FocusDiv = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  z-index: 30;
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

function Focus(props) {
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

  return (
    <FocusDiv>
      <FocusGoalsPopup
        open={showFocusGoalsPopup}
        goals={
          props.currentFocusSession.goals ? props.currentFocusSession.goals : []
        }
        completedGoals={props.currentFocusSession.completedGoals ? props.currentFocusSession.completedGoals : []}
        close={() => setShowFocusGoalsPopup(false)}
      />
      {showBreakFocusPopup ? (
        <BreakFocusPopup close={() => setShowBreakFocusPopup(false)} />
      ) : null}

      <h1 style={{ color: Colors.navy, fontSize: 80, textAlign: "center" }}>
        STAY FOCUSED!
      </h1>
      <Countdown
        focusLength={focusTime}
        isOpen={!props.currentFocusSession.endTime}
      />
      <FocusText>We are taking care of your messages for you.</FocusText>
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
            onClick={() => setShowBreakFocusPopup(true)}
            style={{ color: Colors.snow, fontSize: 80, margin: "2rem" }}
          />
        </Tooltip>
      </FocusMenuButtons>
    </FocusDiv>
  );
}

export default Focus;
