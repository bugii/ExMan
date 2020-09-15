import React from "react";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const currentStatusSlack = ipcRenderer.send("getAutoResponseStatus", "slack");
console.log(currentStatusSlack);

export default function SwitchesSize() {
  let [checkedslack, setCheckedSlack] = React.useState(
    ipcRenderer.send("getAutoResponseStatus", "slack")
  );
  let [checkedteams, setCheckedTeams] = React.useState(false);

  checkedslack = ipcRenderer.send("getAutoResponseStatus", "slack");

  const toggleCheckedSlack = () => {
    let prev = ipcRenderer.send("toggleAutoResponse", "slack");
    console.log(prev);
    setCheckedSlack((prev) => !prev);
    console.log(typeof setCheckedSlack);
    console.log(checkedslack);
  };

  const toggleCheckedTeams = () => {
    //setCheckedTeams = ipcRenderer.send("toggleAutoResponse", "teams");
    setCheckedTeams((prev) => !prev);
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            color="primary"
            checked={checkedslack}
            onChange={toggleCheckedSlack}
          />
        }
        label="Slack"
      />
      <FormControlLabel
        control={
          <Switch
            color="primary"
            checked={checkedteams}
            onChange={toggleCheckedTeams}
          />
        }
        label="Teams"
      />
    </FormGroup>
  );
}
