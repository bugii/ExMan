import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import React from "react";
import styled from "styled-components";

export const PositiveFeedback = styled.div`
  color: green;
  text-align: center;
`;

export default function GoalsFeedback(props) {
  return (
    <PositiveFeedback>
      <h2 style={{ fontWeight: "bold" }}>
        You did great. You accomplished your goal.
      </h2>
      <ThumbUpIcon style={{ width: "3em", height: "3em" }} />
      <p>You finished {props.data} tasks today.</p>
    </PositiveFeedback>
  );
}
