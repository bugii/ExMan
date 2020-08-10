import React from "react";
import services from "../../services";
import Service from "./Service";

function Services(props) {
  return (
    <div className="services">
      {services.map((service) => (
        <Service
          key={service.name}
          setActiveService={props.setActiveService}
          name={service.name}
          icon={service.icon}
          url={service.url}
        />
      ))}
    </div>
  );
}

export default Services;
