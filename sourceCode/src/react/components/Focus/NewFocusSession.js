import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
import ButtonGroup from "@material-ui/core/ButtonGroup";
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
  let [settings, setSettings] = useState(null);
  let [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    ipcRenderer.on("get-settings", (e, settings) => {
      setSettings(settings);
    });

    ipcRenderer.send("get-settings");
  }, []);

  const handleDurationChange = (e) => {
    setDuration(Number(e.target.value));
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
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={props.open}
      onClose={props.closeDialog}
    >
      <DialogTitle id="simple-dialog-title">Create Focus Session</DialogTitle>

      {settings ? (
        <FormContainer noValidate>
          <ButtonGroup
              orientation="vertical"
              color="primary"
              aria-label="vertical outlined primary button group"
              style={{margin: 10}}
          >
          <ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
            <Button onClick={() => handleSubmit(settings.shortFocusDuration)}>Short - {settings.shortFocusDuration}</Button>
            <Button onClick={() => handleSubmit(settings.mediumFocusDuration)}>Medium - {settings.mediumFocusDuration}</Button>
            <Button onClick={() => handleSubmit(settings.longFocusDuration)}>Long - {settings.longFocusDuration}</Button>
          </ButtonGroup>
            <Button onClick={() => handleSubmit()}>Open</Button>
            <Button onClick={() => setShowCustom(!showCustom)}>Custom</Button>
          </ButtonGroup>

          {showCustom ? (
            <TextField
              id="minutes"
              label="Custom Length (min)"
              type="number"
              onChange={handleDurationChange}
              defaultValue={duration}
              style={{ margin: "1rem" }}
            />
          ) : null}
          <FormButtons>
            <Button
              variant="contained"
              color="0"
              onClick={props.closeDialog}
              style={{ margin: "1rem" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit(duration)}
              style={{ margin: "1rem" }}
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
