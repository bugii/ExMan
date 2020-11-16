import React, { useState } from "react";
import Button from "@material-ui/core/Button";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

function AddOtherService() {
  let [name, setName] = useState("");
  let [url, setUrl] = useState("");

  const handleAddService = (e) => {
    ipcRenderer.send("add-service", {
      name,
      url: "https://" + url,
      isOther: true,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "2rem" }}>
      <h1>Add another service</h1>

      <label>Pick a name for your service</label>
      <input
        style={{ maxWidth: "20rem", marginBottom: "1rem" }}
        onChange={(e) => {
          setName(e.target.value);
        }}
        value={name}
      ></input>

      <label> The url to the service</label>
      <div style={{ maxWidth: "20rem", display: "flex" }}>
        <span style={{ marginRight: ".5rem" }}>https:// </span>
        <input
          style={{ marginBottom: "1rem", flex: 1 }}
          onChange={(e) => {
            setUrl(e.target.value);
          }}
          value={url}
        ></input>
      </div>

      <Button
        style={{ maxWidth: "20rem", marginTop: "2rem" }}
        variant="contained"
        color="primary"
        onClick={handleAddService}
      >
        {"Add service"}
      </Button>
    </div>
  );
}

export default AddOtherService;
