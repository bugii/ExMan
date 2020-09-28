import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
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

  const handleChange = (e) => {
    setDuration(Number(e.target.value));
  };

  const handleSubmit = () => {
    const start = new Date();
    const end = new Date(
      new Date(start).setMinutes(start.getMinutes() + duration)
    );
    console.log(start.toTimeString(), end.toTimeString());
    console.log(start.getTime().toString(), end.getTime().toString());

    ipcRenderer.send("focus-start-request", {
      startTime: start.getTime(),
      endTime: end.getTime(),
    });

    props.closeDialog();
  };

  return (
    <Dialog aria-labelledby="simple-dialog-title" open={props.open}>
      <DialogTitle id="simple-dialog-title">Create Focus Session</DialogTitle>
      <FormContainer noValidate>
        <TextField
          id="minutes"
          label="Session Length (min)"
          type="number"
          onChange={handleChange}
          defaultValue={duration}
          style={{ margin: "1rem" }}
        />
        {/*<TextField
                    id="endTime"
                    label="End Time"
                    type="time"
                    defaultValue="07:30"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300, // 5 min
                    }}
                    style={{margin: "1rem"}}
                />*/}
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
            onClick={handleSubmit}
            style={{ margin: "1rem" }}
          >
            Submit
          </Button>
        </FormButtons>
      </FormContainer>
    </Dialog>
  );
}

export default NewFocusSession;
