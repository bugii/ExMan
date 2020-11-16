import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import styled from "styled-components";
import Colors from "../../Colors";
import GoalsFeedback from "./GoalsFeedback";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const Container = styled.div`
  padding: 2rem;
  color: black;
  background-color: white;
  margin: auto;
  height: 50vh;
`;

function GoalsChart(props) {
  const [goal, setGoal] = useState([]);
  const [goalTarget, setGoalTarget] = useState([]);

  useEffect(() => {
    let goalTemp = [];
    let achievedgoalTemp;

    const focusSession = props.data;

    // get the completed goals of today and push it to an array //
    const d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);

    let doneGoalsPerSession;
    let allCompletedGoals = 0;
    for (let i = 0; i < focusSession.length; i++) {
      if (focusSession[i].startTime > d.getTime()) {
        doneGoalsPerSession = focusSession[i].completedGoals.length;
        allCompletedGoals += doneGoalsPerSession;
      }
    }

    goalTemp.push(allCompletedGoals);

    ////////////////////////////////////////////////////////////

    setGoal(goalTemp);

    ipcRenderer.send("get-settings");
    ipcRenderer.on("get-settings", (e, settings) => {
      let goalArray = [];
      //console.log("settings: ", settings.minimumGoalsPerDay);
      goalArray.push(settings.minimumGoalsPerDay - allCompletedGoals);
      //console.log("goal array", goalArray);
      setGoalTarget(goalArray);
    });
    setGoalTarget(achievedgoalTemp);
  }, []);

  const arbitraryStackKey = "stack1";
  const data = {
    type: "horizontalBar",
    labels: ["Daily focus timer"],
    datasets: [
      // These two will be in the same stack.
      {
        stack: arbitraryStackKey,
        label: "goals done today",
        backgroundColor: "#39FF14",
        data: goal,
        barThickness: 50,
      },
      {
        stack: arbitraryStackKey,
        label: "goal target",
        backgroundColor: "lightgrey",
        data: goalTarget,
        barThickness: 50,
      },
    ],
  };

  const options = {
    title: {
      display: true,
      text: "daily goals target",
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
      {goalTarget > 0 ? (
        <Bar data={data} options={options} />
      ) : (
        <GoalsFeedback data={goal[0]} />
      )}
      {goalTarget > 0 ? (
        <h4 style={{ textAlign: "center" }}>
          You have {goalTarget[0]} tasks to do till you reach your goal.
        </h4>
      ) : (
        <p></p>
      )}
    </Container>
  );
}
//<p>You have {goalTarget} goals to do to reach your goal!</p>;
export default GoalsChart;
