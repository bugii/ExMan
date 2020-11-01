import React, { useState } from "react";
import styled from "styled-components";
import Colors from "../Colors";
import Rating from "@material-ui/lab/Rating";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const RandomPopup = styled.div`
  height: 460px;
  width: 850px;
  background: ${Colors.snow};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function RandomProductivityPopup(props) {
  const [productivity, setRating] = useState(0);

  // const onEnterPress = (event) => {
  //   if (event.key === "Enter") {
  //     handleSubmit();
  //   }
  // };

  // const onClosePress = (event) => {
  //   if (event.key === "Esc") {
  //     onClose();
  //   }
  // };

  const handleSubmit = () => {
    ipcRenderer.send("random-popup-submission", {
      productivity,
      wasMinimized: props.wasMinimized,
    });
    setRating(0);
    props.close();
  };

  const onClose = () => {
    setRating(0);
    props.close();
  };

  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={props.open}
      maxWidth={"lg"}
    >
      <DialogTitle id="simple-dialog-title">Random survey</DialogTitle>
      <RandomPopup>
        <div style={{ position: "absolute", top: 0, right: 0 }}>
          <IconButton onClick={onClose}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </div>
        <p>How productive were you in the last 30 minutes?</p>
        <Rating
          name="rating"
          value={productivity}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />
        <Button
          style={{
            backgroundColor: Colors.navy,
            color: "white",
            width: "200px",
            textAlign: "center",
            margin: "10px",
          }}
          onClick={handleSubmit}
          //onKeyPress={onEnterPress}
        >
          submit
        </Button>
        <Button
          style={{
            backgroundColor: Colors.navy,
            color: "white",
            width: "400px",
            textAlign: "center",
            margin: "10px",
          }}
          onClick={onClose}
          //onKeyPress={onClosePress}
        >
          I have not been working for the last 30 minutes
        </Button>
      </RandomPopup>
    </Dialog>
  );
}

export default RandomProductivityPopup;
