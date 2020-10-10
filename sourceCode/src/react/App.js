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
import ErrorNotAuthed from "./components/Error/ErrorNotAuthed";
import ErrorAlreadyInFocus from "./components/Error/ErrorAlreadyInFocus";
import ErrorFocusOverlap from "./components/Error/ErrorFocusOverlap";
import ErrorWrongFocusDuration from "./components/Error/ErrorWrongFocusDuration";
import RandomProductivityPopup from "./components/Main/RandomProductivityPopup";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;
const log = window.require("electron-log");

console.log = log.log;

function App() {
  const [services, setServices] = useState([]);
  const [activeService, setActiveService] = useState(null);
  const [currentFocusSession, setCurrentFocusSession] = useState(null);
  const [showRandomPopUp, setShowRandomPopUp] = useState(false);
  const [wasMinimized, setWasMinimized] = useState(false);

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
    setServices(services);
  };

  const refreshApp = (id) => {
    ipcRenderer.send("refresh-service", id);
  };

  const returnToFocus = () => {
    ipcRenderer.send("breakFocus", true);
    history.push("/focus");
  };

  const formatTime = (inputTime) => {
    let time = new Date();
    time.setTime(inputTime);
    return time.getHours() + ":" + ("0" + time.getMinutes()).substr(-2);
  };

  useEffect(() => {
    ipcRenderer.on(
      "update-frontend",
      (event, { services, currentFocusSession }) => {
        updateServices(services);
        setCurrentFocusSession(currentFocusSession);
      }
    );

    ipcRenderer.send("update-frontend");

    ipcRenderer.on("focus-start-successful", (e, { startTime, endTime }) => {
      const { services, currentFocusSession } = ipcRenderer.sendSync(
        "update-frontend-sync"
      );
      updateServices(services);
      setCurrentFocusSession(currentFocusSession);
      history.push("/focus");
    });

    ipcRenderer.on("error", (e, redirectPath) => {
      console.log("error - redirect to ", redirectPath);
      history.push(redirectPath);
    });

    ipcRenderer.on("focus-end-successful", (e) => {
      history.push("/summary");
      setCurrentFocusSession(null);
    });

    ipcRenderer.on("open-service", (e, id) => {
      history.push("/services");
      setActiveService(id);
    });

    ipcRenderer.on("notification", (e, { id, title, body }) => {
      const n = new Notification(title, {
        body,
      });
      n.onclick = () => {
        ipcRenderer.send("notification-clicked", id);
      };
    });

    ipcRenderer.on("random-popup-survey", (e, wasMinimized) => {
      if (wasMinimized) {
        console.log(
          "window was minimized, bring to front for random popup survey. Minimize again after answering"
        );
      }
      setWasMinimized(wasMinimized);
      setShowRandomPopUp(true);
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
          currentFocusSession={currentFocusSession}
          refreshApp={refreshApp}
        />
      </div>
      {location.pathname !== "/focus" && currentFocusSession ? (
        <FocusBubble
          handleClick={returnToFocus}
          currentPath={location.pathname}
        />
      ) : null}

      <RandomProductivityPopup
        open={showRandomPopUp}
        close={() => setShowRandomPopUp(false)}
        wasMinimized={wasMinimized}
      />

      <div className="main-content">
        <Route path="/" exact>
          <Home nrOfServices={services.length} />
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
          <Focus currentFocusSession={currentFocusSession} />
        </Route>

        <Route path="/add-service">
          <AddService addApp={addApp} />
        </Route>

        <Route path="/settings">
          <Settings services={services} />
        </Route>

        <Route path="/dashboard">
          <Dashboard
            offeredServices={offeredServices}
            setActiveService={setActiveService}
            formatTime={formatTime}
          />
        </Route>

        <Route path="/summary">
          <Summary
            offeredServices={offeredServices}
            setActiveService={setActiveService}
            formatTime={formatTime}
          />
        </Route>

        <Route path="/not-authed">
          <ErrorNotAuthed />
        </Route>

        <Route path="/already-focused">
          <ErrorAlreadyInFocus />
        </Route>

        <Route path="/focus-overlap">
          <ErrorFocusOverlap />
        </Route>

        <Route path="/wrong-duration">
          <ErrorWrongFocusDuration />
        </Route>
      </div>
    </div>
  );
}

export default App;
