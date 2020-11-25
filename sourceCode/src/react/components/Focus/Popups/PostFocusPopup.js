import React, { useState } from "react";
import styled from "styled-components";
import Colors from "../../Colors";
//import Rating from "@material-ui/lab/Rating";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import TodoList from "../TodoList";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
//import Switch from "@material-ui/core/Switch";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
//import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const PostFocusDiv = styled.div`
  height: 600px;
  width: 850px;
  background: ${Colors.snow};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const QuestionsText = styled.p`
  margin-top: 2em;
  font-weight: bold;
  color: ${Colors.navy};
`;

function PostFocusPopup(props) {
  const [rating, setRating] = useState(null);
  const [comments, setComments] = useState(null);
  const [todoList] = useState(props.goals);
  const [completedList, setCompletedList] = useState(props.completedGoals);

  const deleteTodos = (index, task) => {
    todoList.splice(index, 1);
    if (completedList.indexOf(task) !== -1)
      completedList.splice(completedList.indexOf(task), 1);
  };

  const handleSubmit = () => {
    console.log("Completed on submit: ", completedList);
    console.log("Comments: ", comments);
    ipcRenderer.send("previous-session-update", {
      rating: rating,
      completedGoals: completedList,
      comments: comments,
    });
    props.close();
  };

  const handleToggle = (value) => () => {
    const currentIndex = completedList.indexOf(value);

    if (currentIndex === -1) {
      setCompletedList([...completedList, value]);
    } else {
      setCompletedList(completedList.filter((v) => v !== value));
    }
  };

  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={props.open}
      maxWidth={"lg"}
      onClose={handleSubmit}
    >
      <DialogTitle id="simple-dialog-title">Focus Goals</DialogTitle>
      <PostFocusDiv>
        <div style={{ position: "absolute", top: 0, right: 0 }}>
          <IconButton onClick={handleSubmit}>
            <CloseIcon fontSize="large" />
          </IconButton>
        </div>
        <QuestionsText>
          How productive were you during this focus session?
        </QuestionsText>
        <FormControl style={{ alignItems: "center" }}>
          <RadioGroup
            row
            aria-label="position"
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            style={{
              backgroundColor: "white",
              padding: 5,
              justifyContent: "space-around",
              width: "80%",
            }}
          >
            <FormControlLabel
              value="1"
              control={<Radio />}
              label="1"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="2"
              control={<Radio />}
              label="2"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="3"
              control={<Radio />}
              label="3"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="4"
              control={<Radio />}
              label="4"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="5"
              control={<Radio />}
              label="5"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="6"
              control={<Radio />}
              label="6"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="7"
              control={<Radio />}
              label="7"
              labelPlacement="bottom"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>not at all productive</span>
              <span>moderately productive</span>
              <span>very productive</span>
            </div>
          </RadioGroup>
        </FormControl>
        <QuestionsText>
          Did you accomplish your goals? Mark them off here.{" "}
        </QuestionsText>
        <TodoList
          todoList={todoList}
          completedList={completedList}
          deleteTodos={deleteTodos}
          handleToggle={handleToggle}
          hideDelete={true}
        />
        <QuestionsText>
          Do you have any comments on your last session?
        </QuestionsText>
        <TextField
          label="Comments"
          multiline
          rows={3}
          variant="outlined"
          onChange={(e) => {
            setComments(e.target.value);
          }}
          style={{ width: "400px", backgroundColor: "white" }}
        />
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
      </PostFocusDiv>
    </Dialog>
  );
}

export default PostFocusPopup;
