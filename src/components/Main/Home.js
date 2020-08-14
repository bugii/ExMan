import React, {useState} from "react";
import styled from 'styled-components';
import Colors from '../Colors';
import MenuBoxes from "./MenuBoxes";
import NewFocusSession from "./NewFocusSession";
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const HomeDiv = styled.div`
  position: absolute;
  height: 100vh;
  width: 100%;
  background: ${Colors.snow};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ParagraphText = styled.p`
    color: ${Colors.navy}
`;

function Home(props) {
  // Even if no service is selected (they have z-index: 1) by default, make sure to be on top
  let z = 2;
  if (props.isActive) {
    z = 100;
  }

  const [dialogOpen, setDialogOpen] = useState(false);

  const focusOnClick = (focusSessionLength) => {
    // send ipc message to main process to start session there too (db etc)
    ipcRenderer.send("focus-start", { minutes: focusSessionLength });
    // adjust UI too
    props.setFocus(true);
    props.setFocusLength(focusSessionLength);
  };

  const openDialog = () => {
      setDialogOpen(true);
  };

  const closeDialog = () => {
      setDialogOpen(false);
  };

  return (
    <HomeDiv style={{zIndex: z}}>
      <h1 style={{color: Colors.turquoise}}> EXPECTATION MANAGEMENT</h1>
        <ParagraphText>Welcome to your expectation management
            app. When you need to focus, we will take care of the incoming communications while you are
            away.</ParagraphText>
        <ParagraphText>To begin, add your apps and click
            focus now or schedule your next focus session.</ParagraphText>
        <MenuBoxes handleFocus={openDialog}/>
        <NewFocusSession open={dialogOpen} focusNow={focusOnClick} closeDialog={closeDialog}/>
      <p> Currently added {props.nrOfServices} service/s </p>
    </HomeDiv>
  );
}

export default Home;
