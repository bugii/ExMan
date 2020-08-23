import React from "react";
import styled from "styled-components";
import Tooltip from "@material-ui/core/Tooltip";
import { useHistory } from "react-router-dom";

const { remote } = window.require("electron");
const { Menu, MenuItem } = remote;

export const ServiceIcon = styled.img`
  width: 50px;
  margin: 0.5rem 1rem;
`;

function Service(props) {
  let history = useHistory();

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

  const handleClick = () => {
    props.setActiveService(props.id);
    history.push("/services");
  };

  return (
    <div onContextMenu={contextClick} onClick={handleClick}>
      <Tooltip title={props.name} arrow placement="right">
        <ServiceIcon src={props.icon} />
      </Tooltip>
      {props.unreadCount}
    </div>
  );
}

export default Service;
