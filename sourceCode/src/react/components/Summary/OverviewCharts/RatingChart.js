import React, { useState, useEffect } from "react";
import styled from "styled-components";
//import Colors from "../../Colors";
import Rating from "@material-ui/lab/Rating";

export const RatingDiv = styled.div`
  background-color: white;
  padding: 2rem;
  width: 40%;
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

  useEffect(() => {
    const focusSession = props.data;
    const nrFocusSessions = focusSession.length;
    for (let i = 0; i < focusSession.length; i++) {
      if (focusSession[i].rating !== null) {
        ratingTemp += parseInt(focusSession[i].rating);
      }
    }

    setRating(ratingTemp / nrFocusSessions);
  }, []);

  return (
    <Custom>
      <RatingDiv>
        <h3>Average Rating of all Focus Sessions</h3>
        <Rating
          name="read-only"
          value={rating}
          precision={0.25}
          readOnly
          style={{ marginLeft: 10 }}
          max={7}
        />
      </RatingDiv>
    </Custom>
  );
}

export default RatingChart;
