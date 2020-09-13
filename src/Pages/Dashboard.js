import React, {useEffect, useState} from "react";
import styled from "styled-components";
import Colors from "../components/Colors";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {SummaryDiv} from "../components/Summary/Summary";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Grid from "@material-ui/core/Grid";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const DashboardDiv = styled.div`
  padding: 2rem;
  position: absolute;
  z-index: 1;
  height: 100vh;
  width: 100%;
  overflow: scroll;
  background: ${Colors.snow};
  display: flex;
  flex-direction: column;
`;

function Dashboard() {
    const [pastFocusSessions, setPastFocusSessions] = useState([]);
    const [futureFocusSessions, setFutureFocusSessions] = useState([]);

    useEffect(() => {
        ipcRenderer.on("get-all-past-focus-sessions", (e, focusSessions) => {
            setPastFocusSessions(focusSessions);
        });
        // on mounted -> get all past focus sessions and do something with it
        ipcRenderer.send("get-all-past-focus-sessions");

        ipcRenderer.on("get-all-future-focus-sessions", (e, focusSessions) => {
            setFutureFocusSessions(focusSessions);
        });
        // on mounted -> get all future focus sessions and do something with it
        ipcRenderer.send("get-all-future-focus-sessions");

    }, []);

    const formatTime = (inputTime) => {
        let time = new Date();
        time.setTime(inputTime);
        return time.getHours() + ':' + ("0" + time.getMinutes()).substr(-2);
    };

    // Just displaying all focus sessions, not doing anything with it for now
    return (
        <DashboardDiv>
            <h1 style={{textAlign: "center", color: Colors.navy}}>DASHBOARD</h1>

            <Grid>
                <Grid item xs={12}>
                    <h2>Past Focus Sessions Data</h2>
                    {pastFocusSessions.map((focusSession) => (
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                from {formatTime(focusSession.startTime)} to {formatTime(focusSession.endTime)}
                            </AccordionSummary>
                            <AccordionDetails>
                                <div><b>Focus Session ID: &nbsp;</b>{focusSession.id}</div>
                                <div><b>Services: </b></div>
                                <List>
                                    {focusSession.services.reverse().map((service) => (
                                        <ListItem key={service.id}>
                                            <ListItemText> <b>{service.name}</b>
                                                {service.messages.map((message) => (
                                                    <div key={message.body}>{message.body}</div>
                                                ))}
                                            </ListItemText>
                                        </ListItem>
                                    ))}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Grid>
                <Grid item>
                    <h2>Future Focus Sessions Data</h2>
                    {futureFocusSessions.map((focusSession) => (
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                from {formatTime(focusSession.startTime)} to {formatTime(focusSession.endTime)}
                            </AccordionSummary>
                            <AccordionDetails>
                                <div><b>Focus Session ID: &nbsp;</b>{focusSession.id}</div>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Grid>
            </Grid>
        </DashboardDiv>
    );
}

export default Dashboard;
