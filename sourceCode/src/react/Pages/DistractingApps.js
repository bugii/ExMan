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

  const addItem = () => {
    setDisArray(disArray.concat(todo));
    ipcRenderer.send("update-distracting-apps", disArray.concat(todo));
    console.log("Add item: ", todo);
    setTodo("");
  };

  const onEnterPress = (event) => {
    if (event.key === "Enter") {
      addItem();
    }
  };

  const deleteItem = (el) => {
    var index = disArray.indexOf(el);
    if (index > -1) {
      disArray.splice(index, 1);
      ipcRenderer.send("update-distracting-apps", disArray);
    }
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  useEffect(() => {
    ipcRenderer.on("distracting-apps", (e, array) => {
      setDisArray(array);
    });
    ipcRenderer.send("distracting-apps");
  }, []);

  return (
    <DistApp>
      <h1> Distracting Apps and Websites</h1>

      <h4>Number of distracting apps: {disArray.length}</h4>
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
      <Options>
        <AddItem>
          <h2>Add Item</h2>
          <p
            style={{
              width: "60%",
              marginBottom: "5vh",
              margin: "auto",
              textAlign: "left",
            }}
          >
            If you want to add a website, make sure that you just add the
            domainname as an app. For example if you want to add youtube.com
            just add youtube.
          </p>
          <input
            id="item"
            type="text"
            value={todo}
            onChange={handleChange}
            onKeyPress={onEnterPress}
            style={{ margin: "15px 5px 5px 5px", width: "60%", height: "5vh" }}
          />
          <br></br>
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
