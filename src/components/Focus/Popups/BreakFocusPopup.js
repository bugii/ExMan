import React from "react";
import styled from "styled-components";
import Colors from "../../Colors";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

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
    <BreakFocusWarning>
      <h2>Do you really want to break your focus?</h2>
      <Button
        style={{
          backgroundColor: Colors.snow,
          color: "black",
          marginRight: "20px",
        }}
        onClick={minimizeFocus}
      >
        Yes, let me see the messages.
      </Button>
      <Button
        style={{ backgroundColor: Colors.snow, color: "black" }}
        onClick={returnToFocus}
      >
        No, I want to keep focused.
      </Button>
    </BreakFocusWarning>
  );
}

export default BreakFocusPopup;
