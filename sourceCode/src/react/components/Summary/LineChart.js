import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";
import moment from "moment";

export const CustomLine = styled.div`
  padding: 2rem;
  width: 60%;
  display: flex;
`;

function LineChart(props) {
  let serviceIndex;
  let messageIndex;
  let timestampArray = [];
  let labels = [];

  const timechanger = (timestamp) => {
    let coeff = 1000 * 60 * 5;
    let rounded = new Date(Math.round(timestamp / coeff) * coeff);
    return rounded;
  };

  const labelcreator = (focusStart, focusEnd) => {
    let tempvariable = new Date(focusStart * 1000);
    let endDate = new Date(focusEnd * 1000);
    labels.push(timechanger(focusStart));
    while (tempvariable < endDate) {
      tempvariable = moment(tempvariable).add(5, "m");
      labels.push(Date.parse(timechanger(tempvariable)));
    }
    //console.log(labels);
  };

  const [startTime, setStartTime] = useState(true);
  const [endTime, setEndTime] = useState(true);
  const [timedata, setTimedata] = useState([]);

  useEffect(() => {
    const focusSession = props.data;
    for (serviceIndex in focusSession.services) {
      if (focusSession.services[serviceIndex].messages !== 0) {
        for (messageIndex in focusSession.services[serviceIndex].messages) {
          timestampArray.push(
            timechanger(
              focusSession.services[serviceIndex].messages[messageIndex]
                .timestamp
            )
          );
        }
      }
    }

    //console.log(timestampArray);
    const focusStart = props.data.startTime;
    const focusEnd = props.data.endTime;
    labelcreator(focusStart, focusEnd);
    setStartTime(focusStart);
    setEndTime(focusEnd);

    setTimedata(timestampArray);
  }, []);

  const data = {
    labels: timedata,
    datasets: [
      {
        label: "incoming messages for the previous focus session",
        data: timedata,
      },
    ],
  };

  const options = {
    scales: {
      xAxes: [
        {
          type: "time",
          ticks: {
            minRotation: 30,
            maxRotation: 60,
            min: startTime,
            max: endTime,
          },
          time: {
            minUnit: "minute",
            displayFormats: {
              second: "YYYY-MM-DD HH:mm:ss",
              minute: " HH:mm",
              hour: "YYYY-MM-DD HH",
              //  day: "YYYY-MM-DD",
              //  week: "YYYY-MM-DD",
              //  month: "YYYY-MM",
              //  quarter: "YYYY [Q]Q",
              //  year: "YYYY",
            },
            tooltipFormat: "HH:mm:ss",
          },
        },
      ],
    },
  };

  return (
    <CustomLine>
      <Line data={data} options={options} />
    </CustomLine>
  );
}

export default LineChart;
