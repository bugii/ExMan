import React, {useState} from "react";
import styled from "styled-components";
import Colors from "../../Colors";
import Button from "@material-ui/core/Button";
import TodoList from "../TodoList";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import List from "@material-ui/core/List";
import CloseIcon from "@material-ui/icons/Close";
import {SummaryDiv} from "../../Summary/Summary";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
//import GoalsTable from "../GoalsTable";

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
    const [todoList, setTodoList] = useState([]);

    const listItems = todoList.map((number) => <li>{number}</li>);

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
                onClick={props.closePreFocusPopup}
            >
                {" start focus session "}
            </Button>
        </PreFocusDiv>
    );
}

export default PreFocusPopup;
