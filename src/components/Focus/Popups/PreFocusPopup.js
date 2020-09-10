import React, {useState} from "react";
import styled from "styled-components";
import Colors from "../../Colors";
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

export const ToDoListDiv = styled.div`
    text-align: left;
`;

function PreFocusPopup(props) {

    let [todo, setTodo] = useState("");
    let [todoList, setTodoList] = useState([]);

    const listItems = todoList.map((number) => <li>{number}</li>);

    const handleChange = (e) => {
        setTodo(e.target.value);
    };

  const addTodos = () => {
    //var item = document.getElementById("item").value;
    setTodoList(todoList.concat(todo));
    console.log("Add Todo: ", todo);
    setTodo("");
  };

  const deleteTodos = () => {
      todoList.splice(0, 1);
  };

  return (
    <PreFocusDiv>
      <h2>What do you want to focus on during this focus session?</h2>
        <ToDoListDiv>{listItems}
      <input id="item" type="text" value={todo} onChange={handleChange} style={{margin: "15px 5px 5px 5px"}}/>
        </ToDoListDiv>
        <div style={{ display: "flex" }}>
        <Button
          style={{
            marginRight: "10px",
            marginTop: "10px",
            borderRadius: "5px",
          }}
          variant="contained"
          color="primary"
          onClick={addTodos}
        >
          Add
        </Button>
        <Button
          style={{ marginTop: "10px", borderRadius: "5px" }}
          variant="contained"
          color="primary"
          onClick={deleteTodos}
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
