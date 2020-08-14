import React, { useState, useEffect } from "react";
import serviceDefaults from "../../serviceDefaults";
import styled from "styled-components";
import Colors from "../Colors";

export const AddServiceDiv = styled.div`
  position: fixed;
  z-index: 150;
  height: 100vh;
  width: 100%;
  background: ${Colors.snow};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export default function AddService(props) {
  const services = Object.keys(serviceDefaults);

  return (
    <AddServiceDiv>
      <div onClick={props.closeAddingApp}>close</div>
      {services.map((service) => (
        <div key={service} onClick={() => props.addApp(service)}>
          {service}
        </div>
      ))}
    </AddServiceDiv>
  );
}
