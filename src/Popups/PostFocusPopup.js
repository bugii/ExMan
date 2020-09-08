import React from "react";
import styled from "styled-components";
import Colors from "../components/Colors";

export const PostFocusDiv = styled.div`
  position: absolute;
  z-index: 2;
  height: 80vh;
  width: 100%;
  background: ${Colors.snow};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function PreFocusPopup(props) {
  return (
    <PostFocusDiv>
      <h2>How satisfied are you with your previous focus session?</h2>

      <button onClick={props.closePostFocusPopup}> close</button>
    </PostFocusDiv>
  );
}

export default PreFocusPopup;
