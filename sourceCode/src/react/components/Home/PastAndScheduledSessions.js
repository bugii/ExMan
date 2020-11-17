import React from "react";
import Colors from "../Colors";
import Grid from "@material-ui/core/Grid";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Rating from "@material-ui/lab/Rating";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Button from "@material-ui/core/Button";
import styled from "styled-components";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const GoalsList = styled.ul`
  list-style: none;
  margin-top: 0px;
  margin-bottom: 15px;
  padding-left: 0px;
  width: 50%;
`;

export const GoalsDiv = styled.div`
  display: flex;
  flex-direction: row;
  text-align: left;
  justify-content: space-evenly;
`;

export const CompletedListItem = styled.li`
  &:before {
    content: "✓  ";
  }
  color: green;
`;

export const IncompleteListItem = styled.li`
  &:before {
    content: "X  ";
  }
  color: red;
`;

function PastAndScheduledSessions(props) {
  const formatSessionTimes = (start, end) => {
    let date = new Date(start);
    let startTime = new Date();
    let endTime = new Date();
    startTime.setTime(start);
    endTime.setTime(end);
    return (
      date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear() +
      " : " +
      startTime.getHours() +
      ":" +
      ("0" + startTime.getMinutes()).substr(-2) +
      " to " +
      endTime.getHours() +
      ":" +
      ("0" + endTime.getMinutes()).substr(-2)
    );
  };

  const cancelFutureSession = (sessionId) => {
    console.log("Cancelling session: ", sessionId);
    ipcRenderer.send("cancel-future-focus-session", sessionId);
  };

  return (
    <div style={{ width: "90%" }}>
      <Grid
        container
        justify="center"
        spacing={3}
        style={{ textAlign: "center" }}
      >
        <Grid item xs={6}>
          <h1 style={{ color: Colors.turquoise, fontSize: 50, margin: 10 }}>
            {props.pastFocusSessions.length}
          </h1>
          <h2 style={{ margin: 15 }}>Past Focus Sessions</h2>
          {[...props.pastFocusSessions].reverse().map((focusSession) => (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                {formatSessionTimes(
                  focusSession.startTime,
                  focusSession.endTime
                )}
                <Rating
                  name="read-only"
                  value={focusSession.rating}
                  readOnly
                  style={{ marginLeft: 10 }}
                  max={7}
                />
              </AccordionSummary>
              <AccordionDetails style={{flexDirection: "column"}}>
                <GoalsDiv>
                  <GoalsList>
                    {focusSession.completedGoals.length > 0 ? (
                        focusSession.completedGoals.map((goal) => (
                            <CompletedListItem>{goal}</CompletedListItem>
                        ))
                    ) : (
                        <div style={{ color: "gray" }}>No completed goals</div>
                    )}
                  </GoalsList>
                  <GoalsList>
                    {focusSession.goals.filter(
                        (goal) => !focusSession.completedGoals.includes(goal)
                    ).length > 0 ? (
                        focusSession.goals
                            .filter(
                                (goal) => !focusSession.completedGoals.includes(goal)
                            )
                            .map((goal) => (
                                <IncompleteListItem>{goal}</IncompleteListItem>
                            ))
                    ) : (
                        <div style={{ color: "gray" }}>No incomplete goals</div>
                    )}
                  </GoalsList>
                </GoalsDiv>
                {focusSession.comments ? <div style={{textAlign: "left"}}> Comments: {focusSession.comments}</div> : null}
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
        <Grid item xs={6}>
          <h1 style={{ color: Colors.turquoise, fontSize: 50, margin: 10 }}>
            {props.futureFocusSessions.length}
          </h1>
          <h2 style={{ margin: 15 }}>Future Focus Sessions</h2>
          {props.futureFocusSessions.map((focusSession) => (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                {formatSessionTimes(
                  focusSession.startTime,
                  focusSession.endTime
                )}
              </AccordionSummary>
              <AccordionDetails style={{ justifyContent: "center" }}>
                <Button
                  variant="contained"
                  onClick={() => cancelFutureSession(focusSession.id)}
                >
                  Cancel Session
                </Button>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}

export default PastAndScheduledSessions;
