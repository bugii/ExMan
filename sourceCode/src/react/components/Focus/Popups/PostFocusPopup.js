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
import Typography from "@material-ui/core/Typography";
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
`;

function LikertLabel(rating, text) {
  return (
    <div style={{ textAlign: "center" }}>
      <Typography variant="title"> {rating} </Typography>
      <br />
      <Typography variant="title"> {text} </Typography>
    </div>
  );
}

function PostFocusPopup(props) {
  const [rating, setRating] = useState(null);
  const [todoList] = useState(props.goals);
  const [completedList, setCompletedList] = useState(props.completedGoals);

  const deleteTodos = (index, task) => {
    todoList.splice(index, 1);
    if (completedList.indexOf(task) !== -1)
      completedList.splice(completedList.indexOf(task), 1);
  };

  const handleSubmit = () => {
    console.log("Completed on submit: ", completedList);
    ipcRenderer.send("previous-session-update", {
      completedGoals: completedList,
      rating: rating,
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
        <p>How productive were you during this focus session?</p>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="position"
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          >
            <FormControlLabel
              value="1"
              control={<Radio />}
              label={LikertLabel(1, "not at all productive")}
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
              label={LikertLabel(4, "moderately productive")}
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
              label={LikertLabel(7, "very productive")}
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
        <br />
        <p>Did you accomplish your goals? Mark them off here.</p>
        <TodoList
          todoList={todoList}
          completedList={completedList}
          deleteTodos={deleteTodos}
          handleToggle={handleToggle}
          hideDelete={true}
        />
        <br />
        <p>Do you have any comments on your last session?</p>
        <div>
          <TextField
            label="Comments"
            multiline
            rows={4}
            variant="outlined"
            style={{ width: 400 }}
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
      </PostFocusDiv>
    </Dialog>
  );
}

export default PostFocusPopup;
