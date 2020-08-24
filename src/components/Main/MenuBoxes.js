import React from "react";
import styled from "styled-components";
import TodayIcon from "@material-ui/icons/Today";
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Colors from "../Colors";
import { useHistory } from "react-router-dom";

const electron = window.require("electron");
const remote = electron.remote;
const ipcRenderer = electron.ipcRenderer;

export const MenuBoxContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-content: center;
  flex-wrap: wrap;
  align-items: center;
`;

export const MenuBoxDiv = styled.div`
  height: 300px;
  width: 300px;
  margin: 15px;
  background-color: ${Colors.turquoise};
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const MenuIcon = styled.div`
  color: ${Colors.navy};
`;

function MenuBoxes(props) {
  let history = useHistory();

  const openAddingApp = () => {
    history.push("/add-service");
  };

  return (
    <MenuBoxContainer>
      <MenuBoxDiv onClick={props.handleFocusNow}>
        <MenuIcon>
          <FilterCenterFocusIcon style={{ fontSize: 150 }} />
        </MenuIcon>
        focus now
      </MenuBoxDiv>
      <MenuBoxDiv onClick={props.handleScheduleFocus}>
        <MenuIcon>
          <TodayIcon style={{ fontSize: 150 }} />
        </MenuIcon>
        schedule focus
      </MenuBoxDiv>
      <MenuBoxDiv onClick={openAddingApp}>
        <MenuIcon>
          <AddCircleOutlineIcon style={{ fontSize: 150 }} />
        </MenuIcon>
        add app
      </MenuBoxDiv>
    </MenuBoxContainer>
  );
}

export default MenuBoxes;
