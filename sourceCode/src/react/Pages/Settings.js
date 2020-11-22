import React, { Fragment, useState } from "react";
import styled from "styled-components";
import Colors from "../components/Colors";
import Button from "@material-ui/core/Button";
import ResponseSwitch from "./ResponseSwitch";
import TeamsSwitch from "./TeamsSwitch";
import { useEffect } from "react";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const SettingsDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Settingsbox = styled.div`
  border: 10px solid ${Colors.navy};
  width: 80%;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: ${Colors.turquoise};
`;

function Settings(props) {
  let [autoReply, setAutoReply] = useState("");
  const [shortFocus, setShortFocus] = useState(null);
  const [mediumFocus, setMediumFocus] = useState(null);
  const [longFocus, setLongFocus] = useState(null);
  const [durationGoal, setDurationGoal] = useState(null);
  const [goalsTarget, setGoalsTarget] = useState(null);
  const [password, setPassword] = useState("");
  const [applicationVersion, setApplicationVersion] = useState(null);

  useEffect(() => {
    ipcRenderer.on("get-settings", (e, settings) => {
      setShortFocus(settings.shortFocusDuration);
      setMediumFocus(settings.mediumFocusDuration);
      setLongFocus(settings.longFocusDuration);
      setAutoReply(settings.autoReply);
      setDurationGoal(settings.focusGoalDuration);
      setGoalsTarget(settings.minimumGoalsPerDay);
      setApplicationVersion(settings.appVersion);
    });
    ipcRenderer.send("get-settings");
  }, []);

  const handleChange = (e) => {
    setAutoReply(e.target.value);
  };

  const handleShortFocus = (val) => {
    setShortFocus(val);
    ipcRenderer.send("updateDefaultDuration", {
      type: "short",
      value: parseInt(val),
    });
  };

  const handleMediumFocus = (val) => {
    setMediumFocus(val);
    ipcRenderer.send("updateDefaultDuration", {
      type: "medium",
      value: parseInt(val),
    });
  };

  const handleLongFocus = (val) => {
    setLongFocus(val);
    ipcRenderer.send("updateDefaultDuration", {
      type: "long",
      value: parseInt(val),
    });
  };

  const handleAutoResponseUpdate = (e) => {
    // send ipc message to main process to start session there too (db etc)
    ipcRenderer.send("updateAutoResponse", autoReply);
  };

  const handleMinimumFocusGoal = (val) => {
    // send ipc message to main process to change value in db
    setDurationGoal(val);
  };

  const handleGoalTarget = (val) => {
    // send ipc message to main process to change value in db
    setGoalsTarget(val);
  };

  const handleMinimumFocusGoalUpdate = () => {
    // send ipc message to main process to change value in db
    ipcRenderer.send("updateFocusDurationGoal", parseInt(durationGoal));
  };

  const handleGoalTargetUpdate = () => {
    // send ipc message to main process to change value in db
    ipcRenderer.send("updateGoalTarget", parseInt(goalsTarget));
  };

  const changeApplicationVersion = (password) => {
    ipcRenderer.send("application-update-request", password);
    // Update frontend with new settings
    ipcRenderer.send("get-settings");
  };

  return (
    <SettingsDiv>
      <h1>SETTINGS</h1>
      {applicationVersion === "exman" ? (
        <Fragment>
          <Settingsbox>
            <h4>Customize Auto-response</h4>
            <p>Set your customized auto-response message:</p>
            <input
              value={autoReply}
              onChange={handleChange}
              style={{ width: "500px", height: "30px" }}
            ></input>
            <br></br>
            <Button
              style={{ marginTop: "10px" }}
              variant="contained"
              color="primary"
              onClick={handleAutoResponseUpdate}
            >
              {" save auto-response"}
            </Button>
          </Settingsbox>

          <Settingsbox>
            <h4>Auto-responding platforms</h4>
            <p>
              Choose which communication platform should do an auto response
            </p>
            <ResponseSwitch services={props.services} />
          </Settingsbox>
        </Fragment>
      ) : null}
      <Settingsbox>
        <h4>Default focus times (in minutes)</h4>
        <div>
          <span style={{ "padding-right": "1rem" }}>Short focus</span>
          <input
            value={shortFocus}
            onChange={(e) => handleShortFocus(e.target.value)}
          />
        </div>
        <div>
          <span style={{ "padding-right": "1rem" }}>Medium focus</span>
          <input
            value={mediumFocus}
            onChange={(e) => handleMediumFocus(e.target.value)}
          />
        </div>
        <div>
          <span style={{ "padding-right": "1rem" }}>Long focus</span>
          <input
            value={longFocus}
            onChange={(e) => handleLongFocus(e.target.value)}
          />
        </div>
      </Settingsbox>
      <Settingsbox>
        <h4> Focus Goal duration</h4>
        <p>How long do you want to focus per day at minimum</p>
        <div>
          <span style={{ "padding-right": "1rem" }}>
            current focus duration goal (in minutes)
          </span>
          <input
            value={durationGoal}
            onChange={(e) => handleMinimumFocusGoal(e.target.value)}
          />
          <div>
            <Button
              style={{ marginTop: "10px" }}
              variant="contained"
              color="primary"
              onClick={() => handleMinimumFocusGoalUpdate()}
            >
              {" change minimal focus duration goal"}
            </Button>
          </div>
        </div>
      </Settingsbox>
      <Settingsbox>
        <h4> Goals per day</h4>
        <p>How many goals do you want to accomplish per day at minimum?</p>
        <div>
          <span style={{ "padding-right": "1rem" }}>
            current goal target per day
          </span>
          <input
            value={goalsTarget}
            onChange={(e) => handleGoalTarget(e.target.value)}
          />
          <div>
            <Button
              style={{ marginTop: "10px" }}
              variant="contained"
              color="primary"
              onClick={() => handleGoalTargetUpdate()}
            >
              {" change goal target"}
            </Button>
          </div>
        </div>
      </Settingsbox>
      <Settingsbox>
        <h4> Enable teams calls during focus sessions</h4>
        <TeamsSwitch />
      </Settingsbox>
      <Settingsbox>
        <h4> App Version</h4>
        <span style={{ "padding-right": "1rem" }}>
          Current application version (either 'exman' or 'pomodoro'):
        </span>
        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <b>{applicationVersion}</b>
        </div>
        <div>
          <input
            style={{ width: "20rem" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password to change the application version"
          />
        </div>
        <div>
          <Button
            style={{ marginTop: "10px" }}
            variant="contained"
            color="primary"
            onClick={() => changeApplicationVersion(password)}
          >
            change application version
          </Button>
        </div>
      </Settingsbox>
    </SettingsDiv>
  );
}

export default Settings;
