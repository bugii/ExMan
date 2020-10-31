import React from "react";
import styled from "styled-components";
import TodayIcon from "@material-ui/icons/Today";
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";
//import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import Colors from "../Colors";
import { useHistory } from "react-router-dom";

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

  const openDashboard = () => {
    history.push("/dashboard");
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
      <MenuBoxDiv onClick={openDashboard}>
        <MenuIcon>
          <EqualizerIcon style={{ fontSize: 150 }} />
        </MenuIcon>
        dashboard
      </MenuBoxDiv>
    </MenuBoxContainer>
  );
}

export default MenuBoxes;
