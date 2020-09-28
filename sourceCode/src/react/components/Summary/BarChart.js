import React, { useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import styled from "styled-components";

export const CustomBar = styled.div`
  padding: 2rem;
  width: 60%;
  display: flex;
`;

function BarChart(props) {
  let servicesArray = [];
  let servicesBreakArray = [];
  let numOfbreaks;
  let serviceIndex;

  useEffect(() => {
    const focusSession = props.data;
    console.log(focusSession);
    numOfbreaks = focusSession.brokenFocus.length.toString();

    for (serviceIndex in focusSession.services) {
      servicesArray.push(focusSession.services[serviceIndex].name);
      servicesBreakArray.push(
        focusSession.services[serviceIndex].inFocusModeClicks
      );
    }
    //console.log(servicesArray);
    //console.log(servicesBreakArray);
  }, [servicesArray, servicesBreakArray, numOfbreaks]);

  const data = {
    labels: servicesArray,
    datasets: [
      {
        backgroundColor: ["green", "red"],
        data: [2, 3],
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

export default BarChart;
