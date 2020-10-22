import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const FormButtons = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

function NewFocusSession(props) {
    let [duration, setDuration] = useState(40);
    let [menuSelect, setMenuSelect] = useState("custom");
    let [settings, setSettings] = useState(null);

    useEffect(() => {
        ipcRenderer.on("get-settings", (e, settings) => {
            setSettings(settings);
        });

        ipcRenderer.send("get-settings");
    }, []);

    const handleDurationChange = (e) => {
        setDuration(Number(e.target.value));
    };

    const handleMenuSelect = (e) => {
        switch (e.target.value) {
            case 'short':
                setMenuSelect("short");
                setDuration(settings.shortFocusDuration);
                break;
            case 'medium':
                setMenuSelect("medium");
                setDuration(settings.mediumFocusDuration);
                break;
            case 'long':
                setMenuSelect("long");
                setDuration(settings.longFocusDuration);
                break;
            case 'open':
                setMenuSelect("open");
                setDuration(null);
                break;
            case 'custom':
                setMenuSelect("custom");
                setDuration(40);
                break;
            default:
                setDuration(0);
        }
    };

    const handleSubmit = (focusDuration = null) => {
        const start = new Date().getTime();
        let end;
        if (!focusDuration) {
            // open ended
            end = null;
        } else {
            end = start + focusDuration * 1000 * 60;
        }

        console.log(start, end);

        ipcRenderer.send("focus-start-request", {
            startTime: start,
            endTime: end,
        });

        props.closeDialog();
    };

    return (
        <Dialog aria-labelledby="simple-dialog-title" open={props.open} onClose={props.closeDialog}>
            <DialogTitle id="simple-dialog-title">Create Focus Session</DialogTitle>

            {settings ? (
                <FormContainer noValidate>
                    <FormControl style={{margin: "1rem", width: "77%"}}>
                        <InputLabel>Duration</InputLabel>
                        <Select
                            value={menuSelect}
                            onChange={handleMenuSelect}
                        >
                            <MenuItem value={"custom"}>Custom</MenuItem>
                            <MenuItem value={"short"}>Short ({settings.shortFocusDuration})</MenuItem>
                            <MenuItem value={"medium"}>Medium ({settings.mediumFocusDuration})</MenuItem>
                            <MenuItem value={"long"}>Long ({settings.longFocusDuration})</MenuItem>
                            <MenuItem value={"open"}>Open</MenuItem>
                        </Select>
                    </FormControl>
                    {menuSelect === "custom" ?
                        <TextField
                            id="minutes"
                            label="Custom Length (min)"
                            type="number"
                            onChange={handleDurationChange}
                            defaultValue={duration}
                            style={{margin: "1rem"}}
                        /> : null}
                    <FormButtons>
                        <Button
                            variant="contained"
                            color="0"
                            onClick={props.closeDialog}
                            style={{margin: "1rem"}}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSubmit(duration)}
                            style={{margin: "1rem"}}
                        >
                            Submit
                        </Button>
                    </FormButtons>
                </FormContainer>
            ) : null}
        </Dialog>
    );
}

export default NewFocusSession;
