import React, { useState, useEffect } from "react";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export default function SwitchesSize(props) {
  const [teamsCall, setTeamsCall] = useState(null);

  useEffect(() => {
    console.log("teams call", props.state);
    setTeamsCall(props.state);
  }, []);

  const toggleChecked = (state) => {
    ipcRenderer.send("updateTeamsCall", state);
    setTeamsCall(state);
  };

  //console.log(teamsCall);

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            color="primary"
            checked={teamsCall}
            onChange={() => toggleChecked(teamsCall)}
          />
        }
        label={"Teams Call availability"}
      ></FormControlLabel>
    </FormGroup>
  );
}
