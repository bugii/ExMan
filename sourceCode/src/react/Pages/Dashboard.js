import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Colors from "../components/Colors";
import CircularProgress from "@material-ui/core/CircularProgress";
import GoalsChart from "../components/Summary/OverviewCharts/GoalsChart";
import AnalyseChart from "../components/Summary/OverviewCharts/AnalyseChart";
import RatingChart from "../components/Summary/OverviewCharts/RatingChart";
import UsageChart from "../components/Summary/OverviewCharts/UsageChart";
//import ComparisonChart from "../components/Summary/OverviewCharts/ComparisonChart";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const LoadingDiv = styled.div`
  position: fixed;
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
  } else
    return (
      <div>
        <h1 style={{ textAlign: "center", color: Colors.navy }}>DASHBOARD</h1>
        <div>
          <RatingChart style={{ margin: "20px" }} data={pastFocusSessions} />
        </div>
        <div style={{ margin: "20px", height: "300px" }}>
          <GoalsChart data={pastFocusSessions} />

          <AnalyseChart data={pastFocusSessions} />
        </div>
        <div style={{ marginTop: "20px" }}>
          <UsageChart data={pastFocusSessions} />
        </div>
      </div>
    );
}

export default Dashboard;
