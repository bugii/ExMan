import React from "react";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

export const DistApp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  overflow: auto;
  margin: auto;
`;

export const AddItem = styled.div`
  margin: 20px;
  text-align: center;
`;

export const Options = styled.div`
  display: flex;
`;

function DistractingApps() {
  const [disArray, setDisArray] = useState([]);
  let [todo, setTodo] = useState("");
  const [open, setOpen] = useState(false);

  const addItem = () => {
    setDisArray(disArray.concat(todo));
    console.log("Add item: ", todo);
    setTodo("");
  };

  const deleteItem = (el) => {
    var index = disArray.indexOf(el);
    if (index > -1) {
      disArray.splice(index, 1);
    }
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const save = () => {
    ipcRenderer.send("update-distracting-apps", disArray);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    ipcRenderer.on("distracting-apps", (e, array) => {
      setDisArray(array);
    });
    ipcRenderer.send("distracting-apps");
  }, []);

  return (
    <DistApp>
      <h1> Distracting Apps</h1>
      <Button
        style={{ marginTop: "5px", borderRadius: "5px" }}
        variant="contained"
        color="primary"
        onClick={() => save()}
      >
        Save changes
      </Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          distracting apps were updated successfully!
        </Alert>
      </Snackbar>
      <Grid container style={{ padding: "30px" }}>
        {disArray.map((el) => (
          <Grid item style={{ textAlign: "center", marginBottom: "10px" }}>
            <Paper
              style={{
                width: "180px",
                padding: "30px",
                margin: "2px",
                textAlign: "center",
              }}
            >
              {el}
            </Paper>
            <Button
              style={{ marginTop: "5px", borderRadius: "5px" }}
              variant="contained"
              color="primary"
              onClick={() => deleteItem(el)}
            >
              Delete
            </Button>
          </Grid>
        ))}
      </Grid>
      <p>{disArray.length}</p>
      <Options>
        <AddItem>
          <h2>Add Item</h2>
          <input
            id="item"
            type="text"
            value={todo}
            onChange={handleChange}
            style={{ margin: "15px 5px 5px 5px" }}
          />
          <Button
            style={{
              marginRight: "10px",
              marginTop: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              textAlign: "center",
            }}
            variant="contained"
            color="primary"
            onClick={() => addItem()}
          >
            Add
          </Button>
        </AddItem>
      </Options>
    </DistApp>
  );
}

export default DistractingApps;
