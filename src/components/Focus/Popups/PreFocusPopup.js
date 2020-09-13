import React, {useEffect, useState} from "react";
import styled from "styled-components";
import Colors from "../../Colors";
import Button from "@material-ui/core/Button";
import TodoList from "../TodoList";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CloseIcon from "@material-ui/icons/Close";
import OutlinedInput from "@material-ui/core/OutlinedInput";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const PreFocusDiv = styled.div`
  position: absolute;
  z-index: 2;
  height: 80vh;
  width: 900px;
  background: ${Colors.snow};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  color: ${Colors.navy};
  overflow: auto;

  input {
    width: 300px;
    height: 25px;
  }
`;

function PreFocusPopup(props) {

    const [todo, setTodo] = useState("");
    const [todoList, setTodoList] = useState(props.goals);

    const onEnterPress = (event) => {
        if (event.key === 'Enter') {
            addTodos();
        }
    };
    const handleChange = (e) => {
        setTodo(e.target.value);
    };

    const addTodos = () => {
        //var item = document.getElementById("item").value;
        setTodoList(todoList.concat(todo));
        console.log("Add Todo: ", todo);
        setTodo("");
    };

    const deleteTodos = (index) => {
        todoList.splice(index, 1);
    };

    const handleSubmit = () => {
        ipcRenderer.send("focus-goals-request", {
            goals: todoList
        });
        props.closePreFocusPopup();
    };

    useEffect(() => {
        ipcRenderer.on("focus-goals-set", (e) => {
            props.closePreFocusPopup();
        });
    }, []);

    return (
        <PreFocusDiv>
            <div style={{position: 'absolute', top: 15, right: 15}}>
                <IconButton onClick={props.closePreFocusPopup}>
                    <CloseIcon fontSize="large"/>
                </IconButton>
            </div>
            <h1 style={{margin: 0}}>FOCUS GOALS</h1>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "90%",
                margin: 20
            }}>
                <div style={{width: 320}}>
                    <p>What do you want to focus on during this focus session?</p>
                    <OutlinedInput
                        id="todo"
                        size="small"
                        type="string"
                        onChange={handleChange}
                        value={todo}
                        onKeyPress={onEnterPress}
                        /*endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    ria-label="add"
                                    size="medium"
                                    onClick={addTodos}
                                    edge="end"
                                >
                                    <AddCircleIcon style={{fontSize: 40}}/>
                                </IconButton>
                            </InputAdornment>
                        }*/
                    />
                </div>
                <div style={{minWidth: 150, textAlign: 'center'}}>
                    <IconButton
                        ria-label="add"
                        size="medium"
                        onClick={addTodos}
                    >
                        <AddCircleIcon style={{fontSize: 40, color: Colors.turquoise}}/>
                    </IconButton>
                </div>
                <TodoList todoList={todoList} deleteTodos={deleteTodos} todo={todo} handleChange={handleChange}
                          addTodos={addTodos}/>
            </div>

            <Button
                style={{
                    backgroundColor: Colors.navy,
                    color: "white",
                    width: "200px",
                    textAlign: "center",
                }}
                onClick={handleSubmit}
            >
                submit
            </Button>
        </PreFocusDiv>
    );
}

export default PreFocusPopup;
