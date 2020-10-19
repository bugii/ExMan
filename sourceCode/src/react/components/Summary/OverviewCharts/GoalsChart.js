import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Colors from "../../Colors";
import Rating from "@material-ui/lab/Rating";

export const Circle = styled.div`
  padding: 2rem;
  height: 200px;
  width: 200px;
  display: inline;
  background-color: ${Colors.turquoise};
  border-radius: 50%;
  text-align:center;
  color:white;
  font-weight:bold;
`;

export const Goals = styled.div`
  background-color:white;
  padding:3rem;
  float:left;
  margin:auto;
  width:40%;
  text-align:center;
`;

export const Text = styled.div`
  background-color:white;
  margin-top:40px;
  font-weight:bold;
`;

export const RatingDiv = styled.div`
  background-color:white;
  padding:3rem;
  float:right;
  margin:auto;
  width:40%;
  height:100%;
  text-align:center;
`;

export const Custom = styled.div`
  background-color:${Colors.navy};
  padding:3rem;
`;



function GoalsChart(props) {
  let goalTemp = 0;
  let achievedgoalTemp = 0;
  let ratingTemp = 0;

  const [goals, setgoals] = useState(0);
  const [reachedGoals, setreachedGoals] = useState(0);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const focusSession = props.data;
    const nrFocusSessions = focusSession.length;
    console.log(focusSession);
    for (let i = 0; i < focusSession.length; i++) {
      goalTemp += focusSession[i].goals.length;
      achievedgoalTemp += focusSession[i].completedGoals.length;
      if (focusSession[i].rating !== null) {
        ratingTemp += focusSession[i].rating;
      }
    }
    
    setRating(ratingTemp / nrFocusSessions);
    setgoals(goalTemp);
    setreachedGoals(achievedgoalTemp);
    
  }, []);

  return (
    <Custom>
      <Goals>
        <h3 style={{ marginBottom: "40px" }}> Goals: </h3>
        <Circle>
          {reachedGoals/goals} %
        </Circle>
        <Text>
          <p>total goals: { goals }</p>
          <p>reached goals: {reachedGoals}</p>
        </Text>
      </Goals>
      <RatingDiv>
        <h3>Average Rating of all Focus Sessions</h3>
        <Rating
          name="read-only"
          value={rating}
          readOnly
          style={{ marginLeft: 10 }}>
        </Rating>
      </RatingDiv>
      
    </Custom>
  );
}

export default GoalsChart;
