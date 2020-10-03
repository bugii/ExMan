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
  const [stress, setStress] = useState(0);

  const handleSubmit = () => {
    ipcRenderer.send("random-popup-submission", {
      productivity,
      stress,
    });
    props.close();
  };

  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={props.open}
      maxWidth={"lg"}
    >
      <DialogTitle id="simple-dialog-title">Radom survey</DialogTitle>
      <RandomPopup>
        <div style={{ position: "absolute", top: 0, right: 0 }}>
          <IconButton onClick={props.close}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </div>
        <p>How productive do you feel currently?</p>
        <Rating
          name="rating"
          value={productivity}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />
        <p>How stressed do you feel currently?</p>
        <Rating
          name="stress"
          value={stress}
          onChange={(event, newValue) => {
            setStress(newValue);
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
        >
          submit
        </Button>
      </RandomPopup>
    </Dialog>
  );
}

export default RandomProductivityPopup;
