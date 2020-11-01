import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import styled from "styled-components";
import Colors from "../Colors";

export const CustomBar = styled.div`
  padding: 2rem;
  width: 60%;
  display: flex;
`;

export const PlaceHolder = styled.div`
  padding: 100px;
  display: flex;
  background-color: white;
  border: solid black;
  vertical-align: middle;
  text-align: center;
`;

function BarChart(props) {
  let serviceIndex;
  let messageIndex;
  let timestampArray = [];

  const makeArr = (startValue, stopValue, cardinality) => {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
      arr.push(startValue + step * i);
    }
    return arr;
  };

  const dataCreator = (dataArray, bins) => {
    let countingArray = [];
    let counter;
    for (let i = 0; i < bins.length; i++) {
      counter = 0;
      for (let j = 0; j < dataArray.length; j++) {
        if (bins[i] < dataArray[j] && dataArray[j] <= bins[i + 1]) {
          counter += 1;
        }
      }
      countingArray.push(counter);
    }
    return countingArray;
  };

  //const [startTime, setStartTime] = useState(true);
  //const [endTime, setEndTime] = useState(true);
  const [label, setlabel] = useState([]);
  const [frequency, setfrequency] = useState([]);

  useEffect(() => {
    const focusSession = props.data;
    for (serviceIndex in focusSession.services) {
      if (focusSession.services[serviceIndex].messages !== 0) {
        for (messageIndex in focusSession.services[serviceIndex].messages) {
          timestampArray.push(
            focusSession.services[serviceIndex].messages[messageIndex].timestamp
          );
        }
      }
    }

    const focusStart = props.data.startTime;
    const focusEnd = props.data.endTime;
    const bins = makeArr(focusStart, focusEnd, 10);
    //setStartTime(focusStart);
    //setEndTime(focusEnd);
    setlabel(
      bins.map(function (d) {
        d = new Date(d).toLocaleTimeString();
        return d;
      })
    );
    setfrequency(dataCreator(timestampArray.sort(), bins));
  }, []);

  const data = {
    labels: label,
    datasets: [
      {
        backgroundColor: Colors.turquoise,
        label: "incoming messages for the previous focus session",
        data: frequency,
      },
    ],
  };

  const noMessages = (array) => {
    for (let k = 0; k > array.length; k++) {
      if (array[k] !== 0) return false;
    }
    return true;
  };

  return (
    <CustomBar>
      {noMessages(frequency) === false ? (
        <Bar data={data} />
      ) : (
        <PlaceHolder>
          <p>No messages were sent during the past focus session.</p>
        </PlaceHolder>
      )}
    </CustomBar>
  );
}

export default BarChart;
