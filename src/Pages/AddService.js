import React from "react";
import offeredServices from "../offeredServices";
import styled from "styled-components";
import Colors from "../components/Colors";
import { useHistory } from "react-router-dom";

export const AddServiceDiv = styled.div`
  position: absolute;
  z-index: 1;
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
    margin: 2px auto;
    border-radius: 5px;
  }
  div:hover {
    cursor: pointer;
    background-color: ${Colors.turquoise};
    color: black;
  }
`;

export default function AddService(props) {
  let history = useHistory();
  const services = Object.keys(offeredServices);

  const closeAddingApp = () => {
    history.goBack();
  };

  return (
    <AddServiceDiv>
      <h1> Add a prefered service to your ExMan setup</h1>
      <div
        style={{ backgroundColor: Colors.navy, color: "white" }}
        onClick={closeAddingApp}
      >
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
