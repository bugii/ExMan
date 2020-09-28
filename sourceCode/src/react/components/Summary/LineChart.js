import React, { useEffect } from "react";
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
    return rounded.toString();
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
  }, []);

  const data = {
    labels: [1, 2, 3],
    datasets: [
      {
        label: "incoming messages for the previous focus session",
        data: [1, 2, 3],
      },
    ],
  };

  return (
    <CustomLine>
      <Line data={data} />
    </CustomLine>
  );
}

export default LineChart;
