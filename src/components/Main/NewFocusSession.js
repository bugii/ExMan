import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import styled from 'styled-components';

export const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

function NewFocusSession(props) {

    const [minutes, setMinutes] = useState(40);
    const [endTime, setEndTime] = useState("7:30");
    const now = new Date();

    const handleChange = (event) => {
        if (event.target.id === "minutes") {
            setMinutes(event.target.value);
            //let hours = (now + event.target.value).getHours().toString();
            //let min = (now + event.target.value).getMinutes().toString();
            let newEndTime = now.setMinutes((new Date()).getMinutes()+event.target.value);
            setEndTime(newEndTime);
            console.log("New End Time: ", newEndTime);
        }
        else {
            setEndTime(event.target.value);
            setMinutes(event.target.value - now);
            console.log("New Minutes: ", event.target.value - now);
        }
    };

    const handleSubmit = () => {
        props.focusNow(minutes);
        props.closeDialog();
    };

    return (
        <Dialog onClose={handleSubmit} aria-labelledby="simple-dialog-title" open={props.open}>
            <DialogTitle id="simple-dialog-title">Create Focus Session</DialogTitle>
            <FormContainer noValidate>
                <TextField
                    id="minutes"
                    label="Session Length (min)"
                    type="number"
                    defaultValue="40"
                    onChange={handleChange}
                    style={{margin: "1rem"}}
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
                <Button variant="contained" color="primary" onClick={handleSubmit}
                        style={{margin: "1rem"}}>Submit</Button>
            </FormContainer>
        </Dialog>
    );
}

export default NewFocusSession;