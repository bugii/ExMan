import React, {useState} from "react";
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
      if (service.name === "teams" || service.name === "slack") {
          return (
              <div>
                  {service.autoResponse ? "on" : "off"}
                  <FormControlLabel
                      control={
                          <Switch
                              color="primary"
                              checked={service.autoResponse}
                              onChange={() => toggleChecked(service.id)}
                          />
                      }
                      label={service.customName ? (service.name + " - " + service.customName) : service.name}
                      style={{marginLeft: 10}}
                  />
              </div>
          );
      }
  });

  return (
    <SettingContainer>
      <FormGroup style={{ margin: "20px" }}>{serviceCheckers}</FormGroup>
    </SettingContainer>
  );
}
