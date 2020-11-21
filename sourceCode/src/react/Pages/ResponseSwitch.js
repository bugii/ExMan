import React from "react";
import styled from "styled-components";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const SettingContainer = styled.div`
  display: flex;
`;

export const SettingValues = styled.div`
  background-color: #3f51b5;
  padding: 15px;
  align-items: center;
  color: white;
  border-radius: 6px;
`;

export default function SwitchesSize(props) {
  const toggleChecked = (id) => {
    ipcRenderer.send("toggleAutoResponse", id);
  };

  const serviceCheckers = props.services.map((service) => {
    if (service.name === "teams") {
      //console.log(service.autoResponse);
      return (
        <FormControlLabel
          control={
            <Switch
              color="primary"
              checked={service.autoResponse}
              onChange={() => toggleChecked(service.id)}
            />
          }
          label={service.customName}
        ></FormControlLabel>
      );
    } else if (service.name === "slack") {
      //console.log(service.autoResponse);
      return (
        <FormControlLabel
          control={
            <Switch
              color="primary"
              checked={service.autoResponse}
              onChange={() => toggleChecked(service.id)}
            />
          }
          label={service.customName}
        ></FormControlLabel>
      );
    }
  });

  return (
    <SettingContainer>
      <SettingValues>false</SettingValues>
      <FormGroup style={{ margin: "20px" }}>{serviceCheckers}</FormGroup>
      <SettingValues>true</SettingValues>
    </SettingContainer>
  );
}
