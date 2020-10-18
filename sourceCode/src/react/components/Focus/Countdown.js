import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Colors from "../Colors";

export const CountdownContainer = styled.div``;

export const OutterCircle = styled.div`
  height: 300px;
  width: 300px;
  background-color: ${Colors.snow};
  border-radius: 100%;
  position: relative;
`;

export const InnerCircle = styled.div`
  height: 275px;
  width: 275px;
  background-color: ${Colors.navy};
  border-radius: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const TimeNumber = styled.p`
  font-size: 150px;
  color: ${Colors.snow};
  margin: 0px;
  text-align: center;
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const TimeText = styled.text`
  font-size: 30px;
  color: ${Colors.snow};
  margin: 0px;
  text-align: center;
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

function Countdown(props) {
  const [minutesLeft, setMinutesLeft] = useState(props.focusLength);
  useEffect(() => {
    setInterval(() => {
      setMinutesLeft((s) => s - 1);
    }, 1000 * 60);
  }, []);

  return (
    <CountdownContainer>
      <OutterCircle>
        <InnerCircle>
          <TimeNumber> {props.isOpen ? "∞" : minutesLeft} </TimeNumber>
          <TimeText> minutes left </TimeText>
        </InnerCircle>
      </OutterCircle>
    </CountdownContainer>
  );
}

export default Countdown;
