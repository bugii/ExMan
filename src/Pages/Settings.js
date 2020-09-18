import React, { useState } from "react";
import styled from "styled-components";
import Colors from "../components/Colors";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import ResponseSwitch from "./ResponseSwitch";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const SettingsDiv = styled.div`
  position: absolute;
  z-index: 1;
  height: 100vh;
  width: 100%;
  background: ${Colors.snow};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Settingsbox = styled.div`
  border: 1px solid black;
  width: 80%;
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 10px;
`;

function Settings(props) {
  let history = useHistory();
  let [autoReply, setAutoReply] = useState("");

  const handleChange = (e) => {
    setAutoReply(e.target.value);
  };

  const autoResponse = (e) => {
    // send ipc message to main process to start session there too (db etc)
    ipcRenderer.send("updateAutoResponse", autoReply);
    console.log("Response update successful");
    history.push("/");
  };

  return (
    <SettingsDiv>
      <h2>Settings</h2>
      <Settingsbox>
        <h4>Customize Auto-response</h4>
        <p>Set your customized auto-response message:</p>
        <input
          value={autoReply}
          onChange={handleChange}
          style={{ width: "500px", height: "30px" }}
        ></input>
        <div>
          <Button
            style={{ marginTop: "10px" }}
            variant="contained"
            color="primary"
            onClick={autoResponse}
          >
            {" save auto-response"}
          </Button>
        </div>
      </Settingsbox>
      <Settingsbox>
        <h4>Auto-responding platforms</h4>
        <p> Choose which communication platform should do an auto response</p>
        <ResponseSwitch services={props.services} />
      </Settingsbox>
    </SettingsDiv>
  );
}

export default Settings;
