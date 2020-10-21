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

function AnalyseChart(props) {
  const [servicesArray, setServicesArray] = useState([]);
  const [servicesBreakArray, setServicesBreakArray] = useState([]);
  const [colorArray, setColorArray] = useState([]);
  const [numOfbreaks, setNumOfbreaks] = useState(null);

  const brokenFocus = (focusObject) => {
    let numOfbreaks = 0;
    for (let i = 0; i < focusObject.length; i++) {
      numOfbreaks += focusObject[i].brokenFocus.length;
    }
    return numOfbreaks;
  };

  const breakFocusUsage = (breakArray) => {
    let duration = 0;
    for (let i = 0; i < breakArray.length; i++) {
      let dur = breakArray[i][1] - breakArray[i][0];
      duration += dur;
    }
    return duration;
  };

  const trueFocus = (duration, pastObj) => {
    let interval;
    let fulllength = 0;
    let truelength;
    for (let i = 0; i < pastObj.length; i++) {
      interval = pastObj[i].endTime - pastObj[i].startTime;
      fulllength += interval;
    }
    truelength = fulllength;
    for (let i = 0; i < duration.length; i++) {
      truelength -= duration[i];
    }
    return [fulllength, truelength];
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
    console.log(serviceObj);
    let servicesTempArray;
    let servicesTempBreakArray = [];
    let colorTempArray = [];
    let timeinFocus;
    let brokenFocusvariable;
    const pastSession = props.data;
    brokenFocusvariable = brokenFocus(pastSession);
    setNumOfbreaks(brokenFocusvariable);
    //console.log(pastSession);

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
        //console.log(serviceObj);
      }
    }
    servicesTempArray = Object.keys(serviceObj);
    //console.log(servicesTempArray);
    colorTempArray = colorCreator(servicesTempArray);
    servicesTempBreakArray = Object.values(serviceObj);
    //console.log(servicesTempBreakArray);
    timeinFocus = trueFocus(servicesTempBreakArray, pastSession);
    console.log("print", timeinFocus[0], timeinFocus[1]);
    servicesTempArray.push("real Time in Focus");
    servicesTempBreakArray.push(timeinFocus[1]);
    colorTempArray.push("red");
    servicesTempBreakArray = toPercent(timeinFocus[0], servicesTempBreakArray);
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
      <Container>
        <Doughnut
          data={data}
          options={{
            legend: { display: true },
            title: {
              display: true,
              text: "usage of applications during focus time",
            },
            maintainAspectRatio: false,
            responsive: true,
            cutoutPercentage: 60,
          }}
          text={text_inside}
        />
        <br />
        <AdditionalText>
          Frequency of focus breaks: {text_inside}
        </AdditionalText>
      </Container>
    </CustomBar>
  );
}

export default AnalyseChart;
