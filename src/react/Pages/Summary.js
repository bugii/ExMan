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
          <div style={{ display: "flex" }}>
            {focusSession.services.map((service) => (
              <Services>
                <div key={service.id}>
                  <h5> {service.name} </h5>
                  <p
                    style={{
                      margin: "auto",
                      width: "80%",
                    }}
                  >
                    {service.messages.map((message) => (
                      <div>
                        <div
                          style={{
                            fontSize: "12px",
                            textAlign: "left",
                            borderTop: "1px solid black",
                          }}
                          key={message.title}
                        >
                          from {message.title}
                        </div>

                        <div
                          style={{
                            borderRadius: "5px",
                            backgroundColor: "white",
                            textAlign: "left",
                            padding: "5px",
                            margin: "10px 0",
                          }}
                          key={message.body}
                        >
                          {service.name == "whatsapp"
                            ? message.body.slice(0, -9)
                            : message.body}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            textAlign: "left",
                          }}
                          key={message.timestamp}
                        >
                          at {message.timestamp}
                        </div>
                      </div>
                    ))}
                  </p>
                </div>
              </Services>
            ))}
          </div>
        </div>
      ) : null}
    </SummaryDiv>
  );
}

export default Summary;
