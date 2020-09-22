import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const { remote } = window.require("electron");

const { Menu, MenuItem } = remote;

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const ServiceDiv = styled.div`
  position: relative;
  display: inline-block;
  width: 82px;
  height: 66px;
`;

export const ServiceIcon = styled.img`
  width: 50px;
  margin: 8px 16px;
`;

export const MessageCountBubble = styled.div`
  height: 18px;
  width: 18px;
  background-color: red;
  border-radius: 100%;
  position: absolute;
  top: 0px;
  right: 0px;
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
  menu.append(
    new MenuItem({
      label: "Refresh",
      click() {
        console.log(`refreshing ${props.id}`);
        props.refreshApp(props.webContentsId);
      },
    })
  );

  const contextClick = () => {
    // Don't show context menu if in focus mode
    if (!props.currentFocusSession)
      menu.popup({ window: remote.getCurrentWindow() });
  };

  const handleClick = () => {
    ipcRenderer.send("updateBreakFocusService", props.id);
    props.setActiveService(props.id);
    history.push("/services");
  };

  return (
    <ServiceDiv>
      {!props.isAuthed || !props.isReady ? (
        <MessageCountBubble> ! </MessageCountBubble>
      ) : null}
      {props.unreadCount ? (
        <MessageCountBubble> {props.unreadCount} </MessageCountBubble>
      ) : null}
      <div
        onContextMenu={contextClick}
        onClick={handleClick}
        style={{ position: "absolute" }}
      >
        <ServiceIcon src={props.icon} />
      </div>
    </ServiceDiv>
  );
}

export default Service;
