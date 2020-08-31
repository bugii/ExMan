import React from "react";
import styled from "styled-components";
import Colors from "../components/Colors";
import Button from "@material-ui/core/Button";

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

export const AutoResponse = styled.div`
  border: 1px solid black;
  width: 80%;
  padding: 20px;
  border-radius: 20px;
`;

function Settings() {
  return (
    <SettingsDiv>
      <h2>Settings</h2>
      <AutoResponse>
        <h4>Auto-response</h4>
        <p>Set your customized auto-response message:</p>
        <input style={{ width: "500px", height: "30px" }}></input>
        <div>
          <Button
            style={{ marginTop: "10px" }}
            variant="contained"
            color="primary"
          >
            {" save auto-response"}
          </Button>
        </div>
      </AutoResponse>
    </SettingsDiv>
  );
}

export default Settings;
