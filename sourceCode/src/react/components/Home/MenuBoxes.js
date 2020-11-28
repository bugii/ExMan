import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import TodayIcon from "@material-ui/icons/Today";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import FilterCenterFocusIcon from "@material-ui/icons/FilterCenterFocus";
import Colors from "../Colors";
import Button from "@material-ui/core/Button";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import Tooltip from "@material-ui/core/Tooltip";

const {ipcRenderer} = window.require("electron");

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
  padding: 10px;
  margin: 15px;
  background-color: ${Colors.turquoise};
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const MenuIcon = styled.div`
  color: ${Colors.navy};
`;

function MenuBoxes(props) {
    let history = useHistory();

    const [calendarRegistered, setCalendarRegistered] = useState("");

    const openDashboard = () => {
        history.push("/dashboard");
    };

    const handleOutlookCalClick = () => {
        ipcRenderer.send("outlook-cal-register-start");
    };

    const handleGoogleCalClick = () => {
        ipcRenderer.send("google-cal-register-start");
    };

    const handleRemoveCalendarClick = () => {
        ipcRenderer.once("tokens", (e, tokens) => {
            if (tokens.google) {
                setCalendarRegistered("google");
                ipcRenderer.send("get-all-future-focus-sessions");
            } else if (tokens.microsoft) {
                setCalendarRegistered("microsoft");
                ipcRenderer.send("get-all-future-focus-sessions");
            } else {
                setCalendarRegistered(null);
            }
        });
        ipcRenderer.send("remove-calendar");
    };

    useEffect(() => {
        ipcRenderer.once("calendar-successfully-added", (e, type) => {
            setCalendarRegistered(type);
        });

        ipcRenderer.once("tokens", (e, tokens) => {
            if (tokens.google) {
                setCalendarRegistered("google");
                ipcRenderer.send("get-all-future-focus-sessions");
            } else if (tokens.microsoft) {
                setCalendarRegistered("microsoft");
                ipcRenderer.send("get-all-future-focus-sessions");
            }
        });
        ipcRenderer.send("tokens");
    }, []);

    return (
        <MenuBoxContainer>
            <MenuBoxDiv onClick={props.handleFocusNow}>
                <MenuIcon>
                    <FilterCenterFocusIcon style={{fontSize: 150}}/>
                </MenuIcon>
                focus now
            </MenuBoxDiv>
            <MenuBoxDiv>
                <MenuIcon>
                    <TodayIcon style={{fontSize: 150}}/>
                </MenuIcon>
                {calendarRegistered ? (
                    <div style={{textAlign: "center"}}>
                        {calendarRegistered} calendar connected
                        <Tooltip title="schedule events with the word 'focus' in the subject">
                            <InfoOutlinedIcon style={{marginLeft: 5}}/>
                        </Tooltip>
                        <Button onClick={handleRemoveCalendarClick} style={{position: "absolute", bottom: 0, left: 38}}>
                            Remove/Change Calendar
                        </Button>
                    </div>
                ) : (
                    <div style={{textAlign: "center"}}>
                      connect calendar <br/>
                      <div style={{position: "absolute", bottom: 6, left: 65}}>
                        <Button onClick={handleOutlookCalClick}>
                          outlook
                        </Button>
                        <Button onClick={handleGoogleCalClick}>
                          google
                        </Button>
                      </div>
                    </div>
                )}
            </MenuBoxDiv>
            <MenuBoxDiv onClick={openDashboard}>
                <MenuIcon>
                    <EqualizerIcon style={{fontSize: 150}}/>
                </MenuIcon>
                dashboard
            </MenuBoxDiv>
        </MenuBoxContainer>
    );
}

export default MenuBoxes;
