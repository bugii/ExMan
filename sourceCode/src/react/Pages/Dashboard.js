import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Colors from "../components/Colors";
import CircularProgress from "@material-ui/core/CircularProgress";
import GoalsChart from "../components/Summary/OverviewCharts/GoalsChart";
import AnalyseChart from "../components/Summary/OverviewCharts/AnalyseChart";
import RatingChart from "../components/Summary/OverviewCharts/RatingChart";
//import UsageChart from "../components/Summary/OverviewCharts/UsageChart";
import StackedBarChart from "../components/Summary/OverviewCharts/StackedBarChart";

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

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 32% 32% 32%;
  grid-gap: 20px;
  padding: 5px;
  @media only screen and (max-width: 1028px) {
    grid-gap: 10px;
    grid-template: 45% 45%;
  }
`;

export const GridItem = styled.div`
  text-align: center;
  padding: 15px 10px;
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
        <GridContainer>
          <GridItem>
            <GoalsChart data={pastFocusSessions} />
          </GridItem>
          <GridItem>
            <AnalyseChart data={pastFocusSessions} />
          </GridItem>
          <GridItem>
            <StackedBarChart data={pastFocusSessions} />
          </GridItem>
        </GridContainer>
      </div>
    );
}

export default Dashboard;
