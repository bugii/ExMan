import React from "react";
import styled from "styled-components";
import Tooltip from "@material-ui/core/Tooltip";
import { useHistory } from "react-router-dom";
import Colors from "../Colors";

const { remote } = window.require("electron");
const { Menu, MenuItem } = remote;

export const ServiceIcon = styled.img`
  width: 50px;
  margin: 0.5rem 1rem;
`;

export const MessageCountBubble = styled.div`
  height: 18px;
  width: 18px;
  background-color: red;
  border-radius: 100%;
  position: absolute;
  top: 5px;
  right: 20px;
  text-align: center;
  font-size: small;
  color: white;
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
    <div
      onContextMenu={contextClick}
      onClick={handleClick}
      style={{ position: "relative" }}
    >
      <Tooltip title={props.name} arrow placement="right">
        <ServiceIcon src={props.icon} />
      </Tooltip>
      {!props.isAuthed || !props.isReady ? (
        <MessageCountBubble> ! </MessageCountBubble>
      ) : (
        false
      )}
      {props.unreadCount ? (
        <MessageCountBubble> {props.unreadCount} </MessageCountBubble>
      ) : (
        false
      )}
    </div>
  );
}

export default Service;
