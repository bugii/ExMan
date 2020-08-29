import React from "react";
import styled from "styled-components";
import Colors from "../components/Colors";

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

function Settings() {
  return (
    <SettingsDiv>
      <h2>Settings</h2>
      <div>App settings such as auto-response template</div>
    </SettingsDiv>
  );
}

export default Settings;
