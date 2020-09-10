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

function ScheduleFocusSession(props) {
  let [start, setStart] = useState(Date());
  let [end, setEnd] = useState(Date());

  const handleStartChange = (e) => {
    setStart(e.target.value);
  };

  const handleEndChange = (e) => {
    setEnd(e.target.value);
  };

  const handleSubmit = () => {
    const startDateTime = new Date(start);
    const endDateTime = new Date(end);
    console.log("start: ", startDateTime);
    console.log("end: ", endDateTime);
    ipcRenderer.send("focus-start-request", {
            startTime: startDateTime.getTime(),
            endTime: endDateTime.getTime(),
        });
    props.closeDialog();
  };

  return (
    <Dialog
      onClose={props.closeDialog}
      aria-labelledby="simple-dialog-title"
      open={props.open}
    >
      <DialogTitle id="simple-dialog-title">Schedule Focus Session</DialogTitle>
      <FormContainer noValidate>
        <TextField
          id="start"
          label="Start"
          type="datetime-local"
          defaultValue={start}
          onChange={handleStartChange}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ margin: "1rem"}}
        />
        <TextField
          id="end"
          label="End"
          type="datetime-local"
          defaultValue={end}
          onChange={handleEndChange}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ margin: "1rem" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ margin: "1rem" }}
        >
          Submit
        </Button>
      </FormContainer>
    </Dialog>
  );
}

export default ScheduleFocusSession;
