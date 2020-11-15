import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import styled from "styled-components";
import DailyFeedback from "./DailyFeedback";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const Container = styled.div`
  width: 40%;
  padding: 2rem;
  color: black;
  background-color: white;
  margin: 40px;
  float: right;
`;

function StackedBarChart(props) {
  const [focus, setFocus] = useState([]);
  const [goal, setGoal] = useState([]);

  let servicesTempBreakArray = [];

  const breakFocusUsage = (breakArray) => {
    let duration = 0;
    for (let i = 0; i < breakArray.length; i++) {
      if (breakArray[i].length === 1) {
      } else if (breakArray[i].length === 2) {
        let dur = breakArray[i][1] - breakArray[i][0];
        duration += dur;
      } else {
        let dur = breakArray[i][2] - breakArray[i][0];
        duration += dur;
      }
    }
    return duration;
  };

  const trueFocus = (pastObj) => {
    const d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);

    let interval;
    let fulllength = 0;
    for (let i = 0; i < pastObj.length; i++) {
      if (pastObj[i].startTime > d.getTime()) {
        interval = pastObj[i].endTime - pastObj[i].startTime;
        fulllength += interval;
      }
    }

    return fulllength / 60000;
  };

  useEffect(() => {
    let serviceIndex;

    let servicesTempBreakArray = [];

    let timeinFocus;

    const pastSession = props.data;

    for (serviceIndex in pastSession) {
      for (let z in pastSession[serviceIndex].services) {
        let service;
        let duration = 0;
        service = pastSession[serviceIndex].services[z].name;
        duration = breakFocusUsage(
          pastSession[serviceIndex].services[z].interactions
        );
      }
    }

    timeinFocus = Math.round(trueFocus(pastSession));
    console.log("time in focus", timeinFocus);
    servicesTempBreakArray.push(timeinFocus);
    console.log("service break array", servicesTempBreakArray);

    setFocus(servicesTempBreakArray);

    ipcRenderer.send("get-settings");
    ipcRenderer.on("get-settings", (e, settings) => {
      let goalArray = [];
      console.log("settings: ", settings.focusGoalDuration);
      goalArray.push(settings.focusGoalDuration - timeinFocus);
      console.log("goal array", goalArray);
      setGoal(goalArray);
    });
  }, []);

  //console.log("focus", focus);

  const arbitraryStackKey = "stack1";
  const data = {
    labels: ["Daily focus timer"],
    datasets: [
      // These two will be in the same stack.
      {
        stack: arbitraryStackKey,
        label: "time in focus",
        backgroundColor: "#39FF14",
        data: focus,
        barThickness: 50,
      },
      {
        stack: arbitraryStackKey,
        label: "goal per day",
        backgroundColor: "lightgrey",
        data: goal,
        barThickness: 50,
      },
    ],
  };

  const options = {
    title: {
      display: true,
      text: "daily focus timer",
    },
    scales: {
      xAxes: [
        {
          stacked: true,
          display: false,
        },
      ],
      yAxes: [
        {
          stacked: true,
          display: false,
        },
      ],
    },
  };
  return (
    <Container>
      {goal[0] > 0 ? (
        <Bar data={data} options={options} />
      ) : (
        <DailyFeedback data={focus[0]} />
      )}
    </Container>
  );
}

export default StackedBarChart;
