import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import styled from "styled-components";
import Colors from "../Colors";

export const CustomBar = styled.div`
  padding: 2rem;
  width: 60%;
`;

export const AdditionalText = styled.div`
  margin-top: 5px;
  text-align: center;
  color: ${Colors.navy};
  font-weight: 900;
`;

function DonutChart(props) {
  const [servicesArray, setServicesArray] = useState([]);
  const [servicesBreakArray, setServicesBreakArray] = useState([]);
  const [colorArray, setColorArray] = useState([]);
  const [numOfbreaks, setNumOfbreaks] = useState(null);

  const breakFocusUsage = (breakArray) => {
    let duration = 0;
    for (let i = 0; i < breakArray.length; i++) {
      let dur = breakArray[i][1] - breakArray[i][0];
      duration += dur;
    }
    return duration;
  };

  const trueFocus = (duration, start, end) => {
    let fulllength = end - start;
    for (let i = 0; i < duration.length; i++) {
      fulllength -= duration[i];
    }
    return fulllength;
  };

  const toPercent = (start, end, array) => {
    let core_value = end - start;
    let temp;
    for (let i = 0; i < array.length; i++) {
      temp = array[i] / core_value;
      array[i] = temp.toFixed(2) * 100;
    }
    return array;
  };

  useEffect(() => {
    let serviceIndex;
    let servicesTempArray = [];
    let servicesTempBreakArray = [];
    let colorTempArray = [];
    let timeinFocus;
    const focusSession = props.data;
    console.log(focusSession);
    setNumOfbreaks(focusSession.brokenFocus.length);

    for (serviceIndex in focusSession.services) {
      let durations = 0;
      durations = breakFocusUsage(
        focusSession.services[serviceIndex].interactions
      );
      servicesTempArray.push(focusSession.services[serviceIndex].name);
      console.log(durations);
      servicesTempBreakArray.push(durations);
      if (focusSession.services[serviceIndex].name === "whatsapp") {
        colorTempArray.push(Colors.whatsapp);
      } else if (focusSession.services[serviceIndex].name === "slack") {
        if (!servicesTempBreakArray.includes("slack")) {
          colorTempArray.push(Colors.slack);
        } else {
          let randomColor = Math.floor(Math.random() * 16777215).toString(16);
          while (colorTempArray.includes(randomColor)) {
            randomColor = Math.floor(Math.random() * 16777215).toString(16);
          }
          colorTempArray.push(randomColor);
        }
      } else if (focusSession.services[serviceIndex].name === "whatsapp") {
        colorTempArray.push(Colors.teams);
      } else {
        let randomColor = Math.floor(Math.random() * 16777215).toString(16);
        colorTempArray.push(randomColor);
      }
    }
    timeinFocus = trueFocus(
      servicesTempBreakArray,
      props.data.startTime,
      props.data.endTime
    );
    servicesTempArray.push("real Time in Focus");
    servicesTempBreakArray.push(timeinFocus);
    colorTempArray.push(Colors.focus);
    servicesTempBreakArray = toPercent(
      props.data.startTime,
      props.data.endTime,
      servicesTempBreakArray
    );
    setServicesArray(servicesTempArray);
    setServicesBreakArray(servicesTempBreakArray);
    setColorArray(colorTempArray);
  }, []);

  const data = {
    labels: servicesArray,
    datasets: [
      {
        backgroundColor: colorArray,
        data: servicesBreakArray,
      },
    ],
  };

  const text_inside = numOfbreaks;

  return (
    <CustomBar>
      <Doughnut
        data={data}
        options={{
          legend: { display: true },
          title: {
            display: true,
            text: "broken focus sessions sorted by services",
          },
          maintainAspectRatio: false,
          responsive: true,
          cutoutPercentage: 60,
        }}
        text={text_inside}
      />
      <br />
      <AdditionalText>Frequency of focus breaks: {text_inside}</AdditionalText>
    </CustomBar>
  );
}

export default DonutChart;
