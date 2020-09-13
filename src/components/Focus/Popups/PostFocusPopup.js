import React, {useState} from "react";
import styled from "styled-components";
import Colors from "../../Colors";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import TodoList from "../TodoList";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

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

    const [todoList, setTodoList] = useState(props.goals ? props.goals : []);

    const deleteTodos = (index) => {
        todoList.splice(index, 1);
    };

    const handleSubmit = () => {
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
                <p>Did you accomplish your goals? Mark them off here.</p>
                <TodoList todoList={todoList} deleteTodos={deleteTodos}/>
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
