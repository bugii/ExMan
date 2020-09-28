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
    const [todoList, ] = useState(props.goals ? props.goals : []);

    const deleteTodos = (index) => {
        todoList.splice(index, 1);
    };

    const handleSubmit = () => {
        /*let list = {todoList : false};
        console.log("TodoList before checkboxes: ", list);
        todoList.map((item) => {
            if (checked.contains(item))
                list[item] = true;
        });*/
        ipcRenderer.send("previous-session-update", {
            goals: todoList,
            rating: rating,
        });
        props.close();
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
                <TodoList todoList={todoList} deleteTodos={deleteTodos} hideDelete={true} />
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
