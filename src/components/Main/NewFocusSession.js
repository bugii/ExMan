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

function NewFocusSession(props) {
  let duration = 40;

  const handleSubmit = () => {
    const start = new Date();
    const end = new Date(
      new Date(start).setMinutes(start.getMinutes() + duration)
    );
    console.log(start.getTime(), end.getTime());

    props.focusNow({ startTime: start, endTime: end });
    props.closeDialog();
  };

  return (
    <Dialog
      onClose={handleSubmit}
      aria-labelledby="simple-dialog-title"
      open={props.open}
    >
      <DialogTitle id="simple-dialog-title">Create Focus Session</DialogTitle>
      <FormContainer noValidate>
        <TextField
          id="minutes"
          label="Session Length (min)"
          type="number"
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

export default NewFocusSession;
