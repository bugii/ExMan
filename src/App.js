import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Webview from "./components/Main/Webview";
import Home from "./components/Main/Home";
import Focus from "./components/Main/Focus";
import serviceDefaults from "./serviceDefaults";
import "./App.scss";

const electron = window.require("electron");
const remote = electron.remote;
const ipcRenderer = electron.ipcRenderer;

function App() {
  const [services, setServices] = useState([]);
  const [nrOfServices, setNrOfServices] = useState(0);
  const [activeService, setActiveService] = useState("home");
  const [isFocus, setFocus] = useState(false);
  const [focusLength, setFocusLength] = useState(0);

  useEffect(() => {
    ipcRenderer.on("get-services", (event, args) => {
      // setNrOfServices(args);
      const { nrOfServices, services } = args;
      setNrOfServices(nrOfServices);
      setServices(services);
    });

    ipcRenderer.send("get-services");
  }, []);

  // Get the current services from the database

  return (
    <div className="app">
      <div className="navigation">
        <Navbar
          setActiveService={setActiveService}
          services={services}
          serviceDefaults={serviceDefaults}
        />
      </div>

      <div className="main-content">
        {isFocus ? <Focus setFocus={setFocus} focusLength={focusLength} /> : null}

        <Home
          isActive={activeService === "home"}
          setFocus={setFocus}
          setFocusLength={setFocusLength}
          nrOfServices={nrOfServices}
        />

        {services.map((service) => (
          <Webview
            isActive={activeService === service.name}
            key={service.name}
            name={service.name}
            useragent={serviceDefaults[service.name].useragent}
            url={serviceDefaults[service.name].url}
            icon={serviceDefaults[service.name].icon}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
