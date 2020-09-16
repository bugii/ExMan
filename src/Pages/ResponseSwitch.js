import React, { useState, useEffect } from "react";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const currentStatusSlack = ipcRenderer.send("getAutoResponseStatus", "slack");
console.log(currentStatusSlack);

export default function SwitchesSize(props) {
  let [checked, setCheckedSlack] = useState(props);
  let [checkedteams, setCheckedTeams] = useState(false);

  checked = ipcRenderer.send("getAutoResponseStatus", "slack");

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
          label={service.id}
        />
      );
    }
  });

  return <FormGroup>{serviceCheckers}</FormGroup>;
}
