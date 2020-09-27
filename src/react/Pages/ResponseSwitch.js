import React from "react";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export default function SwitchesSize(props) {
  const toggleChecked = (id) => {
    ipcRenderer.send("toggleAutoResponse", id);
  };

  const serviceCheckers = props.services.map((service) => {
    if (service.name === "teams" || service.name === "slack") {
      return (
        <FormControlLabel
          control={
            <Switch
              color="primary"
              checked={service.autoResponse}
              onChange={() => toggleChecked(service.id)}
            />
          }
          label={service.name}
        />
      );
    }
  });

  return <FormGroup>{serviceCheckers}</FormGroup>;
}
