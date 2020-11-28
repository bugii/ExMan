import React, { useState, useEffect } from "react";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { SettingContainer, SettingValues } from "./ResponseSwitch";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export default function SwitchesSize(props) {
  const [teamsCall, setTeamsCall] = useState(null);

  useEffect(() => {
    ipcRenderer.on("get-settings", (e, settings) => {
      setTeamsCall(settings.teamsCallFocusAbility);
    });
    ipcRenderer.send("get-settings");
  }, []);

  const toggleChecked = (state) => {
    setTeamsCall(!state);
    ipcRenderer.send("updateTeamsCall", state);
  };

  //console.log("teams call: ", teamsCall);

  return (
    <div>
        {teamsCall ? "on" : "off"}
        <FormControlLabel
          control={
            <Switch
              color="primary"
              checked={teamsCall}
              onChange={() => toggleChecked(teamsCall)}
            />
          }
          label={"Teams Call availability"}
          style={{marginLeft: 10}}
        />
    </div>
  );
}
