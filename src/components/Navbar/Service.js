import React from "react";
import styled from "styled-components";
import Tooltip from "@material-ui/core/Tooltip";

const { remote } = window.require("electron");
const { Menu, MenuItem } = remote;

export const ServiceIcon = styled.img`
  width: 50px;
  margin: 0.5rem 1rem;
`;

function Service(props) {
  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: "Delete Service",
      click() {
        console.log(`Deleting ${props.id}`);
        props.deleteApp(props.id);
      },
    })
  );

  const contextClick = () => {
    menu.popup({ window: remote.getCurrentWindow() });
  };

  return (
    <div
      onContextMenu={contextClick}
      onClick={() => props.setActiveService(props.id)}
    >
      <Tooltip title={props.name} arrow placement="right">
        <ServiceIcon src={props.icon} />
      </Tooltip>
    </div>
  );
}

export default Service;
