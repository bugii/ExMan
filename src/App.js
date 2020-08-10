import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Webview from "./components/Main/Webview";
import services from "./services";

import "./App.scss";

function App() {
  const [activeService, setActiveService] = useState("whatsapp");

  return (
    <div className="app">
      <div className="navigation">
        <Navbar setActiveService={setActiveService} />
      </div>

      <div className="main-content">
        {services.map((service) => (
          <Webview
            isActive={activeService === service.name}
            key={service.name}
            name={service.name}
            url={service.url}
            icon={service.icon}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
