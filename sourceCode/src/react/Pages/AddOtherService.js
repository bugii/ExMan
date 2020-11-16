import React, { useState } from "react";

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
    <div>
      <h1>Add another service</h1>

      <label>name</label>
      <input
        onChange={(e) => {
          setName(e.target.value);
        }}
        value={name}
      ></input>

      <label> url, https://</label>
      <input
        onChange={(e) => {
          setUrl(e.target.value);
        }}
        value={url}
      ></input>

      <button onClick={handleAddService}>Add service</button>
    </div>
  );
}

export default AddOtherService;
