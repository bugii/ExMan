import React, { useState, useEffect } from "react";
import { Route, useHistory } from "react-router-dom";
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

  let history = useHistory();

  const addApp = (name) => {
    ipcRenderer.send("add-service", name);
    history.push("/");
  };

  const deleteApp = (id) => {
    ipcRenderer.send("delete-service", id);
  };

  const updateServices = (services) => {
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
      history.push("/focus");
    });

    ipcRenderer.on("focus-end-successful", (e) => {
      setFocus(false);
      history.push("/");
    });
  }, []);

  return (
    <div className="app">
      <div className="navigation">
        <Navbar
          setActiveService={setActiveService}
          services={services}
          offeredServices={offeredServices}
          deleteApp={deleteApp}
        />
      </div>

      <div className="main-content">
        <Route path="/" exact>
          <Home setFocus={setFocus} nrOfServices={nrOfServices} />
        </Route>
        {/* For the services we don't use the exact prop -> this way it is always rendered. If you just want to show the services and not Home for example -> use history.push("/services") or any other route that has no other matches */}
        <Route path="/">
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
        </Route>
        <Route path="/focus">
          <Focus
            setFocus={setFocus}
            focusLength={(endTime - startTime) / 1000}
          />
        </Route>
        <Route path="/add-service">
          <AddService addApp={addApp} />
        </Route>

        {/* Here all other routes can go */}
      </div>
    </div>
  );
}

export default App;
