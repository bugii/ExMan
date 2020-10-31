import React, {useEffect, useState} from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Colors from "../Colors";
import Grid from "@material-ui/core/Grid";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Rating from "@material-ui/lab/Rating";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Button from "@material-ui/core/Button";
import {LoadingDiv} from "../../Pages/Dashboard";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

function PastAndScheduledSessions() {
    const [pastFocusSessions, setPastFocusSessions] = useState([]);
    const [futureFocusSessions, setFutureFocusSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        ipcRenderer.on("get-all-past-focus-sessions", (e, focusSessions) => {
            setPastFocusSessions(focusSessions);
            setIsLoading(false);
        });
        // on mounted -> get all past focus sessions and do something with it
        ipcRenderer.send("get-all-past-focus-sessions");

        ipcRenderer.on("get-all-future-focus-sessions", (e, focusSessions) => {
            setFutureFocusSessions(focusSessions);
        });
        // on mounted -> get all future focus sessions and do something with it
        ipcRenderer.send("get-all-future-focus-sessions");
    }, []);

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

    if (isLoading) {
        return (
            <LoadingDiv>
                <CircularProgress/>
            </LoadingDiv>
        );
    }

    else
        return (
            <div style={{width: "90%"}}>
                <Grid
                    container
                    justify="center"
                    spacing={3}
                    style={{textAlign: "center"}}
                >
                    <Grid item xs={6}>
                        <h1 style={{color: Colors.turquoise, fontSize: 50, margin: 10}}>
                            {pastFocusSessions.length}
                        </h1>
                        <h2 style={{margin: 15}}>Past Focus Sessions</h2>
                        {[...pastFocusSessions].reverse().map((focusSession) => (
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon/>}
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
                                        style={{marginLeft: 10}}
                                    />
                                </AccordionSummary>
                                <AccordionDetails style={{flexDirection: "column"}}>
                                    Here will be the goals accomplished...
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Grid>
                    <Grid item xs={6}>
                        <h1 style={{color: Colors.turquoise, fontSize: 50, margin: 10}}>
                            {futureFocusSessions.length}
                        </h1>
                        <h2 style={{margin: 15}}>Future Focus Sessions</h2>
                        {futureFocusSessions.map((focusSession) => (
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    {formatSessionTimes(
                                        focusSession.startTime,
                                        focusSession.endTime
                                    )}
                                </AccordionSummary>
                                <AccordionDetails style={{justifyContent: "center"}}>
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
