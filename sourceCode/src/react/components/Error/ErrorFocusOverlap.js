import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Colors from "../Colors";

export const ErrorDiv = styled.div`
  padding: 2rem;
  position: absolute;
  z-index: 1;
  height: 100vh;
  overflow: scroll;
  width: 100%;
  background: ${Colors.snow};
  display: flex;
  flex-direction: column;
  text-align: center;
`;

export const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
`;

function ErrorNotAuthed(props) {
  const history = useHistory();

  return (
    <ErrorDiv>
      <BackButton onClick={() => history.push("/")}>back to home</BackButton>
      <h1>Error</h1>
      <p>
        Overlapping focus periods - Make sure your focus session request does
        not overlap with neither the current focus session or any future
        sessions
      </p>
    </ErrorDiv>
  );
}

export default ErrorNotAuthed;
