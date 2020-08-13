import React from "react";
import styled from 'styled-components';
import HomeIcon from '@material-ui/icons/Home';
import Colors from "../Colors";

export const HomeButtonDiv = styled.div`
  width: 50px;
  margin: 0rem 1rem;
`;

function HomeButton(props) {
  const handleSettingClick = () => {
    props.setActiveService("home");
  };

  return (
    <HomeButtonDiv onClick={handleSettingClick}>
      <HomeIcon style={{color: Colors.snow, fontSize: 50}}/>
    </HomeButtonDiv>
  );
}

export default HomeButton;
