import React, { useState, useEffect } from "react";
import styled from "styled-components";
//import Colors from "../../Colors";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";

export const RatingDiv = styled.div`
  background-color: white;
  padding: 2rem;
  height: 100%;
  text-align: center;
`;

export const Custom = styled.div`
  display: flex;
  height: 150px;
  justify-content: space-around;
`;

function RatingChart(props) {
  let ratingTemp = 0;

  const [rating, setRating] = useState(0);
  const [label, setLabel] = useState(0);

  const roundHalf = (num) => {
    return Math.round(num * 2) / 2;
  };

  useEffect(() => {
    const focusSession = props.data;
    const nrFocusSessions = focusSession.length;
    for (let i = 0; i < focusSession.length; i++) {
      if (focusSession[i].rating !== null) {
        ratingTemp += parseInt(focusSession[i].rating);
      }
    }

    const labels = {
      1: "terrible",
      1.5: "terrible",
      2: "bad",
      2.5: "bad",
      3: "not good",
      3.5: "not good",
      4: "fine",
      4.5: "fine",
      5: "good",
      5.5: "good",
      6: "great",
      6.5: "great",
      7: "fantastic",
    };

    setLabel(labels);

    setRating(ratingTemp / nrFocusSessions);
  }, []);

  return (
    <Custom>
      <RatingDiv>
        <h3>Average Rating of all Focus Sessions</h3>
        <Rating
          name="read-only"
          value={rating}
          precision={0.5}
          readOnly
          style={{ marginLeft: 10 }}
          max={7}
        />
        <Box>{label[roundHalf(rating)]}</Box>
      </RatingDiv>
    </Custom>
  );
}

export default RatingChart;
