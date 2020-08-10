import React from "react";

function Service(props) {
  return (
    <div onClick={() => props.setActiveService(props.name)} className="service">
      <img className="service-icon" src={props.icon} />
    </div>
  );
}

export default Service;
