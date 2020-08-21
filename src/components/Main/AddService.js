import React, { useState, useEffect } from "react";
import offeredServices from "../../offeredServices";
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
  div {
    border: 1px solid black;
    width: 60%;
    text-align: center;
    padding: 20px;
    margin: 0.5px auto;
  }
  div:hover {
    cursor: pointer;
    background-color: ${Colors.turquoise};
    color: black;
  }
  .close {
    background-color: ${Colors.navy};
    color: white;
  }
`;

export default function AddService(props) {
  const services = Object.keys(offeredServices);

  return (
    <AddServiceDiv>
      <div onClick={props.closeAddingApp} className="close">
        close
      </div>
      {services.map((service) => (
        <div key={service} onClick={() => props.addApp(service)}>
          {service}
        </div>
      ))}
    </AddServiceDiv>
  );
}
