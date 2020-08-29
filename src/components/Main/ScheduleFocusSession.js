import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import styled from "styled-components";

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
    setStart(Number(e.target.value));
  };

  const handleEndChange = (e) => {
    setEnd(Number(e.target.value));
  };

  const handleSubmit = () => {
    /*const start = new Date();
        const end = new Date(
            new Date(start).setMinutes(start.getMinutes() + duration)
        );
        console.log(start.getTime(), end.getTime());

        ipcRenderer.send("focus-start-request", {
            startTime: start.getTime(),
            endTime: end.getTime(),
        });
        */
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
          style={{ margin: "1rem" }}
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
