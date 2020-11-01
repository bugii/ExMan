import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Colors from "../Colors";
import MenuBoxes from "./MenuBoxes";
import NewFocusSession from "../Focus/NewFocusSession";
import PastAndScheduledSessions from "./PastAndScheduledSessions";
import CircularProgress from "@material-ui/core/CircularProgress";
import { LoadingDiv } from "../../Pages/Dashboard";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const HomeDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ParagraphText = styled.p`
  color: ${Colors.navy};
`;

function Home(props) {
  const [newFocusSessionDialogOpen, setNewFocusSessionDialogOpen] = useState(
    false
  );
  const [
    scheduleFocusSessionDialogOpen,
    setScheduleFocusSessionDialogOpen,
  ] = useState(false);
  const [pastFocusSessions, setPastFocusSessions] = useState([]);
  const [futureFocusSessions, setFutureFocusSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ipcRenderer.once("get-all-past-focus-sessions", (e, focusSessions) => {
      setPastFocusSessions(focusSessions);
      setIsLoading(false);
    });
    // on mounted -> get all past focus sessions and do something with it
    ipcRenderer.send("get-all-past-focus-sessions");

    ipcRenderer.once("get-all-future-focus-sessions", (e, focusSessions) => {
      setFutureFocusSessions(focusSessions);
    });
    // on mounted -> get all future focus sessions and do something with it
    ipcRenderer.send("get-all-future-focus-sessions");
  }, []);

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

  const getFutureFocusSessions = () => {
    ipcRenderer.on("get-all-future-focus-sessions", (e, focusSessions) => {
      setFutureFocusSessions(focusSessions);
    });
    // on mounted -> get all future focus sessions and do something with it
    ipcRenderer.send("get-all-future-focus-sessions");
  };

  return (
    <HomeDiv>
      <h1 style={{ color: Colors.turquoise }}> EXPECTATION MANAGEMENT</h1>
      <ParagraphText>
        Welcome to your expectation management app. When you need to focus, we
        will take care of the incoming communications while you are away.
      </ParagraphText>
      <ParagraphText>
        To begin, add your apps and click focus now or schedule your next focus
        session.
      </ParagraphText>
      <MenuBoxes
        handleFocusNow={openNewFocusSessionDialog}
        handleScheduleFocus={openScheduleSessionDialog}
      />
      <NewFocusSession
        open={newFocusSessionDialogOpen}
        closeDialog={closeNewFocusSessionDialog}
      />

      <p> Currently added {props.nrOfServices} service/s </p>

      {isLoading ? (
        <LoadingDiv>
          <CircularProgress />
        </LoadingDiv>
      ) : (
        <PastAndScheduledSessions
          pastFocusSessions={pastFocusSessions}
          futureFocusSessions={futureFocusSessions}
        />
      )}
    </HomeDiv>
  );
}

export default Home;
