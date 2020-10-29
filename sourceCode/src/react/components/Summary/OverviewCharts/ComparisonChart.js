import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import styled from "styled-components";
import Colors from "../../Colors";

export const CustomBar = styled.div`
  padding: 2rem;
  text-align: center;
  width: 100%;
  background-color: ${Colors.navy};
  margin-top: 20px;
`;

export const Container = styled.div`
  width: 80%;
  padding: 2rem;
  color: black;
  background-color: white;
  margin: auto;
`;

export const AdditionalText = styled.div`
  margin-top: 5px;
  text-align: center;
  color: ${Colors.navy};
  font-weight: 900;
`;

function ComparisonChart(props) {
  const [servicesArray, setServicesArray] = useState([]);
  const [servicesBreakArray, setServicesBreakArray] = useState([]);
  const [colorArray, setColorArray] = useState([]);

  const breakFocusUsage = (breakArray) => {
    let duration = 0;
    for (let i = 0; i < breakArray.length; i++) {
      let dur = breakArray[i][1] - breakArray[i][0];
      duration += dur;
    }
    return duration;
  };

  const colorCreator = (service_array) => {
    let color_array = [];
    let randomColor = Math.floor(Math.random() * 16777215).toString(16);
    for (let i = 0; i < service_array.length; i++) {
      if (service_array[i] === "whatsapp") color_array.push(Colors.whatsapp);
      else if (service_array[i] === "slack") color_array.push(Colors.slack);
      else if (service_array[i] === "teams") color_array.push(Colors.teams);
      else color_array.push(randomColor);
    }
    return color_array;
  };

  const arrSum = (arr) => arr.reduce((a, b) => a + b, 0);

  const toPercent = (fulllength, array) => {
    let core_value = fulllength;
    let temp;
    for (let i = 0; i < array.length; i++) {
      temp = array[i] / core_value;
      array[i] = temp.toFixed(2) * 100;
    }
    return array;
  };

  useEffect(() => {
    let serviceIndex;
    const serviceObj = {};

    let servicesTempArray;
    let servicesTempBreakArray = [];
    let colorTempArray = [];
    let service_sum;
    const pastSession = props.data;

    for (serviceIndex in pastSession) {
      for (let z in pastSession[serviceIndex].services) {
        let service;
        let duration = 0;
        service = pastSession[serviceIndex].services[z].name;
        duration = breakFocusUsage(
          pastSession[serviceIndex].services[z].interactions
        );
        if (service in serviceObj) {
          serviceObj[service] += duration;
        } else {
          serviceObj[service] = duration;
        }
      }
    }
    servicesTempArray = Object.keys(serviceObj);
    colorTempArray = colorCreator(servicesTempArray);
    servicesTempBreakArray = Object.values(serviceObj);
    service_sum = arrSum(servicesTempBreakArray);
    servicesTempBreakArray = toPercent(service_sum, servicesTempBreakArray);
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
      <Container>
        <Doughnut
          data={data}
          options={{
            legend: { display: true },
            title: {
              display: true,
              text: "usage of applications in focus",
            },
            maintainAspectRatio: false,
            responsive: true,
            cutoutPercentage: 60,
          }}
        />
        <br />
      </Container>
    </CustomBar>
  );
}

export default ComparisonChart;
