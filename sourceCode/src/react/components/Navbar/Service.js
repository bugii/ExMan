import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const { remote } = window.require("electron");

const { Menu, MenuItem } = remote;

//const electron = window.require("electron");

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

export const Loader = styled.div`
  top: 0px;
  right: 0px;
  position: absolute;
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 2px solid #3498db;
  width: 20px;
  height: 20px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

function Service(props) {
  let history = useHistory();

  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: "Delete Service",
      click() {
        props.deleteApp(props.id);
      },
    })
  );
  menu.append(
    new MenuItem({
      label: "Refresh",
      click() {
        props.refreshApp(props.id);
      },
    })
  );

  const contextClick = () => {
    // Don't show context menu if in focus mode
    if (!props.currentFocusSession)
      menu.popup({ window: remote.getCurrentWindow() });
  };

  const handleClick = () => {
    props.setActiveService(props.id);
    history.push(`/services/${props.id}`);
  };

  return (
    <ServiceDiv>
      {props.showBubble &&
      !props.isAuthed &&
      (!props.isReady || props.isReady) ? (
        <MessageCountBubble> ! </MessageCountBubble>
      ) : null}

      {props.showBubble && props.isAuthed && !props.isReady ? (
        <Loader></Loader>
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
