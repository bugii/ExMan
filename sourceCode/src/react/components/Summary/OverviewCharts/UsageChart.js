import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import styled from "styled-components";
import Colors from "../../Colors";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const Container = styled.div`
  width: 60%;
  padding: 2rem;
  color: black;
  background-color: white;
  margin: auto;
  height: 40vh;
  float: left;
`;

export const AdditionalText = styled.div`
  margin-top: 5px;
  text-align: center;
  color: ${Colors.navy};
  font-weight: 900;
`;

function UsageChart(props) {
  const [servicesBreakArray, setServicesBreakArray] = useState([]);

  const [appUsed, setAppUsed] = useState([]);

  const breakFocusUsage = (breakArray) => {
    let duration = 0;
    for (let i = 0; i < breakArray.length; i++) {
      if (breakArray[i].length === 1) {
      } else if (breakArray[i].length === 2) {
        let dur = breakArray[i][1] - breakArray[i][0];
        duration += dur;
      } else {
        let dur = breakArray[i][2] - breakArray[i][0];
        duration += dur;
      }
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

  const toPercent = (fulllength, array) => {
    let core_value = fulllength;
    let temp;
    for (let i = 0; i < array.length; i++) {
      temp = array[i] / core_value;
      array[i] = temp.toFixed(2) * 100;
    }
    return array;
  };

  const focusVsAppUsed = (focus, appUsed) => {
    let array = [];
    array.push(100 * (focus / appUsed).toFixed(2));
    array.push(100 * ((appUsed - focus) / appUsed).toFixed(2));
    return array;
  };

  useEffect(() => {
    let serviceIndex;
    const serviceObj = {};

    let servicesTempBreakArray = [];
    let timeinFocus;
    let appUsedInterval = 0;
    let datareceived;
    const pastSession = props.data;

    for (serviceIndex in pastSession) {
      for (let z in pastSession[serviceIndex].services) {
        let duration = 0;
        let service;
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

    servicesTempBreakArray = Object.values(serviceObj);

    timeinFocus = trueFocus(servicesTempBreakArray, pastSession);

    ipcRenderer.on("appUsage-statistic", (e, appUsedData) => {
      console.log(appUsedData);
      for (let k = 0; k < appUsedData.length; k++) {
        if (appUsedData[k].length === 1) {
        } else if (appUsedData[k].length === 2) {
          let interval = appUsedData[k][1] - appUsedData[k][0];
          appUsedInterval += interval;
        } else {
          let interval = appUsedData[k][2] - appUsedData[k][0];
          appUsedInterval += interval;
        }
      }
      datareceived = focusVsAppUsed(timeinFocus[0], appUsedInterval);
      console.log(datareceived);
      setAppUsed(datareceived);
    });

    ipcRenderer.send("appUsage-statistic");

    servicesTempBreakArray.push(timeinFocus[1]);

    servicesTempBreakArray = toPercent(timeinFocus[0], servicesTempBreakArray);

    setServicesBreakArray(servicesTempBreakArray);
  }, []);

  const datasecond = {
    labels: ["focus", "app used without focus"],
    datasets: [
      {
        backgroundColor: ["blue", "red"],
        data: appUsed,
      },
    ],
  };

  return (
    <Container>
      <Doughnut
        data={datasecond}
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
      />
    </Container>
  );
}

export default UsageChart;
