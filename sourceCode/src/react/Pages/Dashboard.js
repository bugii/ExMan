import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Colors from "../components/Colors";
import CircularProgress from "@material-ui/core/CircularProgress";
import GoalsChart from "../components/Summary/OverviewCharts/GoalsChart";
import AnalyseChart from "../components/Summary/OverviewCharts/AnalyseChart";

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

export const LoadingDiv = styled.div`
  position: absolute;
  z-index: 1;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${Colors.snow};
`;

function Dashboard(props) {
  const [pastFocusSessions, setPastFocusSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ipcRenderer.on("get-all-past-focus-sessions", (e, focusSessions) => {
      setPastFocusSessions(focusSessions);
      setIsLoading(false);
    });
    // on mounted -> get all past focus sessions and do something with it
    ipcRenderer.send("get-all-past-focus-sessions");
  }, []);

  if (isLoading) {
    return (
      <LoadingDiv>
        <CircularProgress />
      </LoadingDiv>
    );
  }

  // Just displaying all focus sessions, not doing anything with it for now
  else
    return (
      <DashboardDiv>
        <h1 style={{ textAlign: "center", color: Colors.navy }}>DASHBOARD</h1>
        <GoalsChart data={pastFocusSessions} />
        <AnalyseChart data={pastFocusSessions} />
      </DashboardDiv>
    );
}

//<ComparisonChart data={pastFocusSessions} />;

export default Dashboard;
