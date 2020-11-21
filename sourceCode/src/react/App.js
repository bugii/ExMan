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
import AddOtherService from "./Pages/AddOtherService";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;
const log = window.require("electron-log");

console.log = log.log;

function App() {
  let history = useHistory();
  let location = useLocation();

  const [services, setServices] = useState([]);
  const [activeService, setActiveService] = useState(null);
  const [isOnService, setIsOnService] = useState(false);
  const [currentFocusSession, setCurrentFocusSession] = useState(null);

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
      history.push(`/services/${id}`);
      setActiveService(id);
    });

    ipcRenderer.on("notification", (e, { id, title, body }) => {
      const n = new Notification(title, {
        body,
        silent: true,
      });
      n.onclick = () => {
        ipcRenderer.send("notification-clicked", id);
      };
    });
    ipcRenderer.on("notification-scheduled-start", (e) => {
      new Notification("Started scheduled focus session", {
        body:
          "Your scheduled focus session (from calendar) has just started. Set your goals now!",
        silent: true,
      });
    });
    ipcRenderer.on("notification-focus-resumed", (e) => {
      new Notification("Resumed previous focus session, ", {
        body: "Keep focusing!",
        silent: true,
      });
    });
    ipcRenderer.on("notification-focus-reminder", (e) => {
      const n = new Notification("Feel like focusing?", {
        body: "Click to start a focus session!",
        silent: true,
      });
      n.onclick = () => {
        ipcRenderer.send("default-focus-start-request");
      };
    });
    ipcRenderer.on("distraction-notification", () => {
      new Notification("Didn't you want to focus?", {
        body: "You can still do it, close this app and keep going!",
        silent: true,
        icon: `${process.env.PUBLIC_URL}/icons/warning.png`,
      });
    });
  }, []);

  useEffect(() => {
    ipcRenderer.send("route-changed", {
      location,
      isFocus: currentFocusSession,
    });
    setIsOnService(location.pathname.includes("services"));
  }, [location]);

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

      {/* For the services we don't use the exact prop -> this way it is always rendered. If you just want to show the services and not Home for example -> use history.push("/services/${id}") */}
      <div className="services" style={{ zIndex: isOnService ? 1 : -1 }}>
        <Route path="/">
          {services.map((service) => {
            if (!service.isOther) {
              return (
                <Webview
                  isActive={activeService === service.id}
                  key={service.id}
                  id={service.id}
                  name={service.name}
                  useragent={offeredServices[service.name].useragent}
                  url={offeredServices[service.name].url}
                  isOther={false}
                />
              );
            } else {
              return (
                <Webview
                  isActive={activeService === service.id}
                  key={service.id}
                  id={service.id}
                  name={service.name}
                  url={service.url}
                  isOther={true}
                />
              );
            }
          })}
        </Route>
      </div>

      {location.pathname !== "/focus" && currentFocusSession ? (
        <FocusBubble
          handleClick={returnToFocus}
          currentPath={location.pathname}
        />
      ) : null}

      <div className="main-content">
        <Route path="/" exact>
          <Home nrOfServices={services.length} />
        </Route>

        <Route path="/focus">
          <Focus currentFocusSession={currentFocusSession} />
        </Route>

        <Route path="/add-service">
          <AddService addApp={addApp} />
        </Route>

        <Route path="/add-other-service">
          <AddOtherService />
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
