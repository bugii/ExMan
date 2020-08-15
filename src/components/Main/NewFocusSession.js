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
  const start = new Date();
  const minutes = 40;
  const [endTime, setEndTime] = useState(
    new Date(start).setMinutes(start.getMinutes() + minutes)
  );

  const handleChange = (event) => {
    if (event.target.id === "minutes") {
      let newEndTime = new Date(start);
      newEndTime.setMinutes(
        newEndTime.getMinutes() + Number(event.target.value)
      );
      setEndTime(newEndTime);
      console.log("start", start);
      console.log("End Time: ", newEndTime);
    } else {
      setEndTime(event.target.value);
      console.log("End Time: ", new Date(event.target.value));
    }
  };

  const handleSubmit = () => {
    props.focusNow({ startTime: start, endTime: endTime });
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
          defaultValue={minutes}
          onChange={handleChange}
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
