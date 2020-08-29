import React from "react";
import styled from "styled-components";
import Colors from "../components/Colors";

export const PreFocusDiv = styled.div`
  position: absolute;
  z-index: 2;
  height: 80vh;
  width: 80%;
  background: ${Colors.snow};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function PreFocusPopup(props) {
  return (
    <PreFocusDiv>
      <h2>What do you want to focus on during this focus session?</h2>

      <input type="text" />
      <button onClick={props.closePreFocusPopup}> close</button>
    </PreFocusDiv>
  );
}

export default PreFocusPopup;
