import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Colors from "../components/Colors";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const DashboardDiv = styled.div`
  padding: 2rem;
  position: absolute;
  z-index: 1;
  height: 100vh;
  width: 100%;
  overflow: scroll;
  background: ${Colors.snow};
  display: flex;
  flex-direction: column;
`;

function Dashboard() {
  const [focusSessions, setFocusSessions] = useState([]);

  useEffect(() => {
    ipcRenderer.on("get-all-past-focus-sessions", (e, focusSessions) => {
      setFocusSessions(focusSessions);
    });
    // on mounted -> get all past focus sessions and do something with it
    ipcRenderer.send("get-all-past-focus-sessions");
  }, []);

  // Just displaying all focus sessions, not doing anything with it for now
  return (
    <DashboardDiv>
      <h2>Dashboard</h2>
      <div>Here go more long-term "stats" and overview</div>

      {focusSessions.map((focusSession) => (
        <div key={focusSession.id}>
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
      ))}
    </DashboardDiv>
  );
}

export default Dashboard;
