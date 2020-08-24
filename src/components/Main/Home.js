import React, {useState} from "react";
import styled from "styled-components";
import Colors from "../Colors";
import MenuBoxes from "./MenuBoxes";
import NewFocusSession from "./NewFocusSession";
import {useParams, useRouteMatch} from "react-router-dom";
import ScheduleFocusSession from "./ScheduleFocusSession";

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
  z-index: 101;
`;

export const ParagraphText = styled.p`
  color: ${Colors.navy};
`;

function Home(props) {
    const [newFocusSessionDialogOpen, setNewFocusSessionDialogOpen] = useState(false);
    const [scheduleFocusSessionDialogOpen, setScheduleFocusSessionDialogOpen] = useState(false);

    const openNewFocusSessionDialog = () => {
        setNewFocusSessionDialogOpen(true);
    };

    const closeNewFocusSessionDialog = () => {
        setNewFocusSessionDialogOpen(false);
    };

    const openScheduleSessionDialog = () => {
        setScheduleFocusSessionDialogOpen(true);
    };

    const closeScheduleSessionDialog = () => {
        setScheduleFocusSessionDialogOpen(false);
    };

    return (
        <HomeDiv>
            <h1 style={{color: Colors.turquoise}}> EXPECTATION MANAGEMENT</h1>
            <ParagraphText>
                Welcome to your expectation management app. When you need to focus, we
                will take care of the incoming communications while you are away.
            </ParagraphText>
            <ParagraphText>
                To begin, add your apps and click focus now or schedule your next focus
                session.
            </ParagraphText>
            <MenuBoxes handleFocusNow={openNewFocusSessionDialog} handleScheduleFocus={openScheduleSessionDialog} openAddingApp={props.openAddingApp}/>
            <NewFocusSession open={newFocusSessionDialogOpen} closeDialog={closeNewFocusSessionDialog}/>
            <ScheduleFocusSession open={scheduleFocusSessionDialogOpen} closeDialog={closeScheduleSessionDialog} />
            <p> Currently added {props.nrOfServices} service/s </p>
        </HomeDiv>
    );
}

export default Home;
