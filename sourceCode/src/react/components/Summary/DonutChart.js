import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import styled from "styled-components";
import Colors from "../Colors";

export const CustomBar = styled.div`
  padding: 2rem;
  width: 60%;
  display: flex;
`;

function DonutChart(props) {
  const [servicesArray, setServicesArray] = useState([]);
  const [servicesBreakArray, setServicesBreakArray] = useState([]);
  const [colorArray, setColorArray] = useState([]);
  const [numOfbreaks, setNumOfbreaks] = useState(null);

  useEffect(() => {
    let serviceIndex;
    let servicesTempArray = [];
    let servicesTempBreakArray = [];
    let colorTempArray = [];
    const focusSession = props.data;
    console.log(focusSession);
    setNumOfbreaks(focusSession.brokenFocus.length);

    for (serviceIndex in focusSession.services) {
      servicesTempArray.push(focusSession.services[serviceIndex].name);
      servicesTempBreakArray.push(
        focusSession.services[serviceIndex].inFocusModeClicks
      );
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
      } else {
        colorTempArray.push(Colors.teams);
      }
    }
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
      <p>{text_inside}</p>
    </CustomBar>
  );
}

export default DonutChart;
