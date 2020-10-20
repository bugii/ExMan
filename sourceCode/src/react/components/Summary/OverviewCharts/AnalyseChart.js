import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import styled from "styled-components";
import Colors from "../../Colors";

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

function AnalyseChart(props) {
  
  useEffect(() => {
    
  }, []);

  return (
    <CustomBar>
      <Doughnut
        
      />
    </CustomBar>
  );
}

export default AnalyseChart;
