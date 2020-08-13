import React from "react";
import HomeButton from "./HomeButton";
import Service from "./Service";
import Colors from "../Colors";
import styled from 'styled-components';

export const NavbarDiv = styled.div`
  width: 100px;
  height: 100vh;
  background-color: ${Colors.navy};
`;

// to get access to the electron package you could alternatively edit the webpack config
// like mentioned here: https://stackoverflow.com/questions/44008674/how-to-import-the-electron-ipcrenderer-in-a-react-webpack-2-setup
// const electron = window.require("electron");
// const ipcRenderer = electron.ipcRenderer;

function Navbar(props) {
  return (
    <NavbarDiv>
      <HomeButton setActiveService={props.setActiveService} />
      <div>
        {props.services.map((service) => (
          <Service
            key={service.name}
            setActiveService={props.setActiveService}
            name={service.name}
            icon={props.serviceDefaults[service.name].icon}
          />
        ))}
      </div>
    </NavbarDiv>
  );
}

export default Navbar;
