import React, {useState} from "react";
import styled from "styled-components";
import Colors from "../../Colors";
import Rating from "@material-ui/lab/Rating";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import TodoList from "../TodoList";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const PostFocusDiv = styled.div`
  height: 460px;
  width: 850px;
  background: ${Colors.snow};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function PostFocusPopup(props) {

    const [rating, setRating] = useState(0);
    const [todoList, ] = useState(props.goals);
    const [completedList, setCompletedList] = useState(props.completedGoals);

    const deleteTodos = (index, task) => {
        todoList.splice(index, 1);
        if (completedList.indexOf(task) !== -1)
            completedList.splice(completedList.indexOf(task), 1);
    };

    const handleSubmit = () => {
        console.log("Completed on submit: ", completedList);
        ipcRenderer.send("previous-session-update", {
            goals: todoList,
            completedGoals: completedList,
            rating: rating,
        });
        props.close();
    };

    const handleToggle = (value) => () => {
        const currentIndex = completedList.indexOf(value);

        if (currentIndex === -1) {
            completedList.push(value);
        } else {
            completedList.splice(currentIndex, 1);
        }
        console.log("Completed after toggle: ", completedList);
    };


    return (
        <Dialog
            aria-labelledby="simple-dialog-title"
            open={props.open}
            maxWidth={"lg"}
        >
            <DialogTitle id="simple-dialog-title" >Focus Goals</DialogTitle>
            <PostFocusDiv>
                <div style={{position: 'absolute', top: 0, right: 0}}>
                    <IconButton onClick={props.close}>
                        <CloseIcon fontSize="large"/>
                    </IconButton>
                </div>
                <p>How productive were you during this focus session?</p>
                <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(event, newValue) => {
                        setRating(newValue);
                    }}
                />
                <p>Did you accomplish your goals? Mark them off here.</p>
                <TodoList todoList={todoList}
                          completedList={completedList}
                          deleteTodos={deleteTodos}
                          handleToggle={handleToggle}
                          hideDelete={true} />
                <Button
                    style={{
                        backgroundColor: Colors.navy,
                        color: "white",
                        width: "200px",
                        textAlign: "center",
                        margin: "10px"
                    }}
                    onClick={handleSubmit}
                >
                    submit
                </Button>
            </PostFocusDiv>
        </Dialog>
    );
}

export default PostFocusPopup;
