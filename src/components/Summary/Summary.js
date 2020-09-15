import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Colors from "../Colors";
import PostFocusPopup from "../Focus/Popups/PostFocusPopup";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Service from "../Navbar/Service";
import Table from "@material-ui/core/Table";
import sampleSummaryChart1 from "../../images/sampleSummaryChart1.png";
import sampleSummaryChart2 from "../../images/sampleSummaryChart2.png";

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

      <div style={{ position: "absolute", top: 15, right: 15 }}>
        <IconButton onClick={handleClose}>
          <CloseIcon fontSize="large" />
        </IconButton>
      </div>

      <h1 style={{ color: Colors.navy }}>SUMMARY</h1>

      {focusSession ? (
        <div>
          <h4>{focusSession.id}</h4>
          <p>
            from {formatTime(focusSession.startTime)} to{" "}
            {formatTime(focusSession.endTime)}
          </p>
          <ChartsDiv>
            <img src={sampleSummaryChart1} alt='chart1' style={{ maxHeight: 300 }} />
            <img src={sampleSummaryChart2} alt='chart2' style={{ maxHeight: 300 }} />
          </ChartsDiv>
          <div style={{ display: "flex" }}>
            {focusSession.services.map((service) => (
              <Table>
                <tr>
                  <th>
                    <Service
                      key={service.id}
                      id={service.id}
                      setActiveService={props.setActiveService}
                      name={service.name}
                      unreadCount={service.unreadCount}
                      icon={props.offeredServices[service.name].icon}
                      deleteApp={props.deleteApp}
                    />
                  </th>
                  {service.messages
                    ? service.messages.map((message) => (
                        <Table>
                          <tr>
                            <th>{message.timestamp}</th>
                            <th>{message.id}</th>
                            <th>{message.body}</th>
                          </tr>
                        </Table>
                      ))
                    : null}
                  {/* Including the following table below as sample data for dev purposes */}
                  <Table>
                    <tr>
                      <th>09:35</th>
                      <th>Taylor</th>
                      <th>This is a test message...</th>
                    </tr>
                  </Table>
                </tr>
              </Table>
            ))}

            {/*focusSession.services.map((service) => (
                                                    <Services>
                                                    <div key={service.id}>
                                                    <h5> {service.name} </h5>
                                                    <p
                                                    style={{
                                                    margin: "auto",
                                                    width: "80%",
                                                    }}
                                                    >
                                                    {service.messages.map((message) => (
                                                    <div>
                                                    <div
                                                    style={{
                                                    fontSize: "12px",
                                                    textAlign: "left",
                                                    borderTop: "1px solid black",
                                                    }}
                                                    key={message.id}
                                                    >
                                                    from {message.id}
                                                    </div>

                                                    <div
                                                    style={{
                                                    borderRadius: "5px",
                                                    backgroundColor: "white",
                                                    textAlign: "left",
                                                    padding: "5px",
                                                    margin: "10px 0",
                                                    }}
                                                    key={message.body}
                                                    >
                                                    {message.body}
                                                    </div>
                                                    <div
                                                    style={{
                                                    fontSize: "12px",
                                                    textAlign: "left",
                                                    }}
                                                    key={message.timestamp}
                                                    >
                                                    at {message.timestamp}
                                                    </div>
                                                    </div>
                                                    ))}
                                                    </p>
                                                    </div>
                                                    </Services>
                                                    ))*/}
          </div>
        </div>
      ) : null}
    </SummaryDiv>
  );
}

export default Summary;
