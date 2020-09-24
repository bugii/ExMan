import React, {useState, useEffect} from "react";
import styled from "styled-components";
import Colors from "../Colors";
import PostFocusPopup from "../Focus/Popups/PostFocusPopup";
import CloseIcon from "@material-ui/icons/Close";
import {useHistory} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Service from "../Navbar/Service";
import Table from "@material-ui/core/Table";
import sampleSummaryChart1 from "../../images/sampleSummaryChart1.png";
import sampleSummaryChart2 from "../../images/sampleSummaryChart2.png";
import MessagesChart from "./MessagesChart";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const SummaryDiv = styled.div`
  padding: 2rem;
  position: absolute;
  z-index: 1;
  height: 100vh;
  overflow: scroll;
  width: 100%;
  background: ${Colors.snow};
  display: flex;
  flex-direction: column;
  text-align: center;
`;

export const ChartsDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  margin: 25px;
`;

export const Services = styled.div`
  background-color: ${Colors.turquoise};
  margin: 10px;
  width: 80%;
  text-align: center;
  border: solid black;
  padding: 10px;
  margin-bottom: 30px;
  border-radius: 5px;
`;

function Summary(props) {
    const [showPostFocusPopup, setshowPostFocusPopup] = useState(true);
    const [focusSession, setFocusSession] = useState(null);

    let history = useHistory();

    const handleClose = () => {
        history.push("/");
    };

    useEffect(() => {
        ipcRenderer.on("get-previous-focus-session", (e, focusSession) => {
            setFocusSession(focusSession);
        });
        // on mounted -> get the last focus session (the one that just finished) and display a summary
        ipcRenderer.send("get-previous-focus-session");
    }, []);

    const formatTime = (inputTime) => {
        let time = new Date();
        time.setTime(inputTime);
        return time.getHours() + ":" + ("0" + time.getMinutes()).substr(-2);
    };

    return (
        <SummaryDiv>
            {showPostFocusPopup && focusSession ? (
                <PostFocusPopup
                    goals={focusSession.goals ? focusSession.goals : []}
                    open={showPostFocusPopup}
                    close={() => setshowPostFocusPopup(false)}
                />
            ) : null}

            <div style={{position: "absolute", top: 15, right: 15}}>
                <IconButton onClick={handleClose}>
                    <CloseIcon fontSize="large"/>
                </IconButton>
            </div>

            <h1 style={{color: Colors.navy}}>SUMMARY</h1>

            {focusSession ? (
                <div>
                    <p>
                        from {formatTime(focusSession.startTime)} to{" "}
                        {formatTime(focusSession.endTime)}
                    </p>
                    <ChartsDiv>
                        <MessagesChart/>
                        {/*<img src={sampleSummaryChart1} alt='chart1' style={{ maxHeight: 300 }} />*/}
                        <img
                            src={sampleSummaryChart2}
                            alt="chart2"
                            style={{maxHeight: 300}}
                        />
                    </ChartsDiv>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Table>
                            {focusSession.services.map((service) => (
                                <tr>
                                    <td style={{width: 150}}>
                                        <Service
                                            key={service.id}
                                            id={service.id}
                                            setActiveService={props.setActiveService}
                                            name={service.name}
                                            unreadCount={service.unreadCount}
                                            icon={props.offeredServices[service.name].icon}
                                            deleteApp={props.deleteApp}
                                        />
                                    </td>
                                    {service.messages.length > 0
                                        ? service.messages.map((message) => (
                                            <tr>
                                                <td>{formatTime(message.timestamp)}</td>
                                                <td>{message.title}</td>
                                                <td>
                                                    {service.name === "whatsapp"
                                                        ? message.body.slice(0, -9)
                                                        : message.body}
                                                </td>
                                            </tr>
                                        ))
                                        : <tr>
                                            <td>09:35</td>
                                            <td>Taylor</td>
                                            <td>This is a test message...</td>
                                        </tr>
                                    }
                                </tr>
                            ))}
                        </Table>
                    </div>
                </div>
            ) : null}
        </SummaryDiv>
    );
}

export default Summary;
