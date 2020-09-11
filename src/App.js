import React, { useState, useEffect } from "react";
import { Route, useHistory, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Webview from "./components/Main/Webview";
import Home from "./components/Home/Home";
import Focus from "./components/Focus/Focus";
import offeredServices from "./offeredServices";
import AddService from "./components/Navbar/AddService";
import "./App.scss";
import FocusBubble from "./components/Focus/FocusBubble";
import Settings from "./Pages/Settings";
import Dashboard from "./Pages/Dashboard";
import Summary from "./components/Summary/Summary";
import NewFocusSession from "./components/Focus/NewFocusSession";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

function App() {
  const [services, setServices] = useState([]);
  const [nrOfServices, setNrOfServices] = useState(0);
  const [activeService, setActiveService] = useState("home");
  const [startTime, setStartTime] = useState(new Date().getTime());
  const [endTime, setEndTime] = useState(new Date().getTime());
  const [inFocus, setInFocus] = useState(false);

  let history = useHistory();
  let location = useLocation();

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

  const returnToFocus = () => {
    history.push("/focus");
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
      setInFocus(true);
      history.push("/focus");
    });

    ipcRenderer.on("focus-end-successful", (e) => {
      setInFocus(false);
      history.push("/summary");
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
      {(location.pathname != "/focus" && inFocus) ? <FocusBubble handleClick={returnToFocus} currentPath={location.pathname}/> : false}

      <div className="main-content">
        <Route path="/" exact>
          <Home nrOfServices={nrOfServices} />
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
          <Focus focusLength={(endTime - new Date()) / 1000} />
        </Route>

        <Route path="/add-service">
          <AddService addApp={addApp} />
        </Route>

        <Route path="/settings">
          <Settings />
        </Route>

        <Route path="/dashboard">
          <Dashboard />
        </Route>

        <Route path="/summary">
          <Summary offeredServices={offeredServices} setActiveService={setActiveService}/>
        </Route>
      </div>
    </div>
  );
}

export default App;
