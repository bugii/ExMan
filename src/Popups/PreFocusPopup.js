import React from "react";
import styled from "styled-components";
import Colors from "../components/Colors";
import Button from "@material-ui/core/Button";

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

  input {
    width: 300px;
    height: 25px;
  }
`;

function PreFocusPopup(props) {
  const todoArray = [];
  const listItems = todoArray.map((number) => <li>{number}</li>);

  const addTodos = async (item) => {
    //var item = document.getElementById("item").value;
    todoArray.push(item);
  };

  const deleteTodos = async () => {
    todoArray.pop();
  };

  return (
    <PreFocusDiv>
      <h2>What do you want to focus on during this focus session?</h2>
      <p>{listItems}</p>
      <input id="item" type="text" />
      <div style={{ display: "flex" }}>
        <Button
          style={{
            marginRight: "10px",
            marginTop: "10px",
            borderRadius: "5px",
          }}
          variant="contained"
          color="primary"
          onClick={addTodos()}
        >
          Add
        </Button>
        <Button
          style={{ marginTop: "10px", borderRadius: "5px" }}
          variant="contained"
          color="primary"
          onClick={deleteTodos()}
        >
          Delete
        </Button>
      </div>
      <Button
        style={{
          marginTop: "25px",
          backgroundColor: Colors.turquoise,
          color: "white",
          width: "200px",
          textAlign: "center",
        }}
        onClick={props.closePreFocusPopup}
      >
        {" start focus session "}
      </Button>
    </PreFocusDiv>
  );
}

export default PreFocusPopup;
