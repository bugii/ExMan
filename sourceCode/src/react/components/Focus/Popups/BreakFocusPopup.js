import React from "react";
import styled from "styled-components";
import Colors from "../../Colors";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const BreakFocusWarning = styled.div`
  background-color: ${Colors.navy};
  width: 50%;
  height: 40%;
  margin: auto;
  color: white;
  position: fixed;
  padding: 30px;
  z-index: 10000;
  border-radius: 20px;
`;

function BreakFocusPopup(props) {
  let history = useHistory();

  const minimizeFocus = () => {
    //navigate back home without ending focus session
    history.push("/");
  };

  const returnToFocus = () => {
    //navigate back to focus screen
    props.close();
    history.push("/focus");
  };

  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={props.open}
      maxWidth={"lg"}
      onClose={props.close}
      style={{ zIndex: 1600 }}
    >
      <DialogTitle
        id="simple-dialog-title"
        style={{ color: "white", backgroundColor: Colors.navy }}
      >
        Do you really want to break your focus?
      </DialogTitle>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: Colors.navy,
        }}
      >
        <Button
          variant="contained"
          onClick={minimizeFocus}
          style={{ width: "fit-content", margin: "1rem" }}
        >
          Yes, let me see my messages.
        </Button>
        <Button
          variant="contained"
          onClick={returnToFocus}
          style={{ width: "fit-content", margin: "1rem" }}
        >
          No, I want to keep focused.
        </Button>
      </div>
    </Dialog>
  );
}

export default BreakFocusPopup;
