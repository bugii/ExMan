import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Colors from "../../Colors";

export const Circle = styled.div`
  padding: 2rem;
  width: 10%;
  height: 10%;
  display: inline;
  background-color: ${Colors.turquoise};
  border-radius: 50%;
  text-align: center;
  color: white;
  font-weight: bold;
`;

export const Goals = styled.div`
  background-color: white;
  width: 40%;
  text-align: center;
`;

export const Text = styled.div`
  background-color: white;
  margin-top: 40px;
  font-weight: bold;
`;

function GoalsChart(props) {
  let goalTemp = 0;
  let achievedgoalTemp = 0;

  const [goals, setgoals] = useState(0);
  const [reachedGoals, setreachedGoals] = useState(0);

  useEffect(() => {
    const focusSession = props.data;
    const nrFocusSessions = focusSession.length;
    for (let i = 0; i < focusSession.length; i++) {
      goalTemp += focusSession[i].goals.length;
      achievedgoalTemp += focusSession[i].completedGoals.length;
    }

    setgoals(goalTemp);
    setreachedGoals(achievedgoalTemp);
  }, []);

  return (
    <Goals>
      <h3 style={{ marginBottom: "40px" }}> Goals: </h3>
      <Circle>{((reachedGoals / goals) * 100).toFixed(2)}%</Circle>
      <Text>
        <p>total goals: {goals}</p>
        <p>achieved goals: {reachedGoals}</p>
      </Text>
    </Goals>
  );
}

export default GoalsChart;
