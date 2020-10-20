import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Colors from "../../Colors";
import Button from "@material-ui/core/Button";
import TodoList from "../TodoList";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CloseIcon from "@material-ui/icons/Close";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const PreFocusDiv = styled.div`
  height: 460px;
  width: 850px;
  background: ${Colors.snow};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  color: ${Colors.navy};
  overflow: auto;
`;

function FocusGoalsPopup(props) {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState(props.goals);
  const [completedList, setCompletedList] = useState(props.completedGoals);

  const onEnterPress = (event) => {
    if (event.key === "Enter") {
      addTodos();
    }
  };
  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const addTodos = () => {
    setTodoList(todoList.concat(todo));
    console.log("Add Todo: ", todo);
    setTodo("");
  };

  const deleteTodos = (index, task) => {
    todoList.splice(index, 1);
    if (completedList.indexOf(task) !== -1)
      completedList.splice(completedList.indexOf(task), 1);
  };

  const handleSubmit = () => {
    ipcRenderer.send("focus-goals-request", {
      goals: todoList,
      completedGoals: completedList
    });
    console.log("focus-goals-request: ", todoList);
    console.log("completed goals: ", completedList);
    props.close();
  };


  const handleToggle = (value) => () => {
    const currentIndex = completedList.indexOf(value);
    const newChecked = [...completedList];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCompletedList(newChecked);
  };

  useEffect(() => {
    ipcRenderer.on("focus-goals-set", (e) => {
      props.close();
    });
  }, []);

  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={props.open}
      maxWidth={"lg"}
    >
      <DialogTitle id="simple-dialog-title">Focus Goals</DialogTitle>
      <PreFocusDiv>
        <div style={{ position: "absolute", top: 0, right: 0 }}>
          <IconButton onClick={props.close}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "90%",
            margin: 20,
          }}
        >
          <div style={{ width: 300 }}>
            <p>What do you want to focus on during this focus session?</p>
            <OutlinedInput
              id="todo"
              size="small"
              type="string"
              onChange={handleChange}
              value={todo}
              onKeyPress={onEnterPress}
              style={{ width: "100%", backgroundColor: "white" }}
            />
          </div>
          <div style={{ margin: 10, textAlign: "center" }}>
            <IconButton aria-label="add" size="medium" onClick={addTodos}>
              <AddCircleIcon
                style={{ fontSize: 40, color: Colors.turquoise }}
              />
            </IconButton>
          </div>
          <TodoList
            todoList={todoList}
            completedList={completedList}
            deleteTodos={deleteTodos}
            handleToggle={handleToggle}
            hideDelete={false}
          />
        </div>

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
      </PreFocusDiv>
    </Dialog>
  );
}

export default FocusGoalsPopup;
