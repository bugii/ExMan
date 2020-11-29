import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import styled from "styled-components";
import Colors from "../Colors";
import FocusGrade from "./OverviewCharts/FocusGrade";

export const CustomBar = styled.div`
  padding-left: 2rem;
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
    setNumOfbreaks(focusSession.brokenFocus.length);

    for (serviceIndex in focusSession.services) {
      let durations = 0;
      durations = breakFocusUsage(
        focusSession.services[serviceIndex].interactions
      );
      servicesTempArray.push(focusSession.services[serviceIndex].name);
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
      } else if (focusSession.services[serviceIndex].name === "teams") {
        colorTempArray.push(Colors.teams);
      } else if (focusSession.services[serviceIndex].name === "telegram") {
        colorTempArray.push(Colors.telegram);
      } else if (focusSession.services[serviceIndex].name === "gmail") {
        colorTempArray.push(Colors.gmail);
      } else if (focusSession.services[serviceIndex].name === "outlook") {
        colorTempArray.push(Colors.outlook);
      } else if (focusSession.services[serviceIndex].name === "outlook365") {
        colorTempArray.push(Colors.outlook);
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

  return (
    <CustomBar>
      <h3>Focus Review</h3>
      <FocusGrade
        goodGrade={servicesBreakArray[servicesBreakArray.length - 1] > 70}
      />
      <br />
      <AdditionalText>Frequency of focus breaks: {numOfbreaks}</AdditionalText>
      <br />
      <h3>Time spent in focus or in each service</h3>
      <Doughnut
        data={data}
        options={{
          legend: { display: true },
          title: {
            display: false,
            text: "Time spent in focus or in each service",
          },
          maintainAspectRatio: true,
          responsive: true,
          cutoutPercentage: 50,
        }}
        text={numOfbreaks}
      />
    </CustomBar>
  );
}

export default DonutChart;
