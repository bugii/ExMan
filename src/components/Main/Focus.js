import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Colors from "../Colors";
import Countdown from "./Countdown";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Tooltip from "@material-ui/core/Tooltip";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";

const electron = window.require("electron");
const remote = electron.remote;
const ipcRenderer = electron.ipcRenderer;

export const FocusDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: ${Colors.turquoise};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // Has to be on top of everything else
  // the currently selected webview has a value of 100, make sure it is always higher than that
  z-index: 200;
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
  let history = useHistory();
  console.log(props);

  const escapeFocus = () => {
    // send ipc message to main process to start session there too (db etc)
    ipcRenderer.send("focus-end-request");
  };

  const minimizeFocus = () => {
    //navigate back home without ending focus session
    props.setFocus(false);
    history.push("/");
  };

  return (
    <FocusDiv>
      <h1 style={{ color: Colors.navy, fontSize: 80, textAlign: "center" }}>
        STAY FOCUSED!
      </h1>
      <Countdown focusLength={props.focusLength} />
      <FocusText>We are taking care of your messages for you.</FocusText>
      <FocusMenuButtons>
        <Tooltip title="End focus session" arrow placement="top">
          <HighlightOffIcon
            onClick={escapeFocus}
            style={{ color: Colors.snow, fontSize: 80, margin: "2rem" }}
          />
        </Tooltip>
        <Tooltip title="Break focus to see chat" arrow placement="top">
          <QuestionAnswerIcon
            onClick={minimizeFocus}
            style={{ color: Colors.snow, fontSize: 80, margin: "2rem" }}
          />
        </Tooltip>
      </FocusMenuButtons>
    </FocusDiv>
  );
}

export default Focus;
