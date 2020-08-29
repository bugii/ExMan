import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Colors from "../components/Colors";
import PostFocusPopup from "../Popups/PostFocusPopup";

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
`;

function Summary(props) {
  const [showPostFocusPopup, setshowPostFocusPopup] = useState(true);
  const [focusSession, setFocusSession] = useState(null);

  useEffect(() => {
    ipcRenderer.on("get-previous-focus-session", (e, focusSession) => {
      setFocusSession(focusSession);
    });
    // on mounted -> get the last focus session (the one that just finished) and display a summary
    ipcRenderer.send("get-previous-focus-session");
  }, []);

  return (
    <SummaryDiv>
      {showPostFocusPopup ? (
        <PostFocusPopup
          closePostFocusPopup={() => setshowPostFocusPopup(false)}
        />
      ) : null}
      <h2>Summary</h2>
      <div>Here goes the summary, charts, etc</div>

      {focusSession ? (
        <div>
          <h4>{focusSession.id}</h4>
          <p>
            from {focusSession.startTime} to {focusSession.endTime}
          </p>
          {focusSession.services.map((service) => (
            <div key={service.id}>
              <h5> {service.name} </h5>
              <p>
                {service.messages.map((message) => (
                  <div key={message.body}>{message.body}</div>
                ))}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </SummaryDiv>
  );
}

export default Summary;
