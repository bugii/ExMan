import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Webview from "./components/Main/Webview";
import Home from "./components/Main/Home";
import Focus from "./components/Main/Focus";
import offeredServices from "./offeredServices";
import AddService from "./components/Main/AddService";
import "./App.scss";

const electron = window.require("electron");
const remote = electron.remote;
const ipcRenderer = electron.ipcRenderer;

function App() {
  const [services, setServices] = useState([]);
  const [nrOfServices, setNrOfServices] = useState(0);
  const [activeService, setActiveService] = useState("home");
  const [isFocus, setFocus] = useState(false);
  const [isAddingApp, setAddingApp] = useState(false);
  const [startTime, setStartTime] = useState(new Date().getTime());
  const [endTime, setEndTime] = useState(new Date().getTime());

  const addApp = (name) => {
    ipcRenderer.send("add-service", name);
    closeAddingApp();
  };

  const deleteApp = (id) => {
    ipcRenderer.send("delete-service", id);
  };

  const openAddingApp = () => {
    setAddingApp(true);
  };

  const closeAddingApp = () => {
    setAddingApp(false);
  };

  const updateServices = (services) => {
    console.log("updating services");

    setNrOfServices(services.length);
    setServices(services);
  };

  useEffect(() => {
    ipcRenderer.on("get-services", (event, services) => {
      updateServices(services);
    });

    ipcRenderer.send("get-services");

    ipcRenderer.on("update-services", (event, services) => {
      updateServices(services);
    });

    ipcRenderer.on("focus-start-successful", (e, { startTime, endTime }) => {
      setStartTime(startTime);
      setEndTime(endTime);
      setFocus(true);
    });

    ipcRenderer.on("focus-end-successful", (e) => {
      setFocus(false);
    });
  }, []);

  // Get the current services from the database

  return (
    <div className="app">
      <div className="navigation">
        <Navbar
          setActiveService={setActiveService}
          services={services}
          offeredServices={offeredServices}
          openAddingApp={openAddingApp}
          deleteApp={deleteApp}
        />
      </div>

      <div className="main-content">
        {isFocus ? (
          <Focus
            setFocus={setFocus}
            focusLength={(endTime - startTime) / 1000}
          />
        ) : null}

        {isAddingApp ? (
          <AddService addApp={addApp} closeAddingApp={closeAddingApp} />
        ) : null}

        <Home
          isActive={activeService === "home"}
          setFocus={setFocus}
          nrOfServices={nrOfServices}
          openAddingApp={openAddingApp}
        />

        {services.map((service) => (
          <Webview
            isActive={activeService === service.id}
            key={service.id}
            id={service.id}
            name={service.name}
            useragent={offeredServices[service.name].useragent}
            url={offeredServices[service.name].url}
            icon={offeredServices[service.name].icon}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
