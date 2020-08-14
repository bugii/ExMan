import React from "react";
import styled from 'styled-components';
import Tooltip from "@material-ui/core/Tooltip";

export const ServiceIcon = styled.img`
  width: 50px;
  margin: 0.5rem 1rem;
`;

function Service(props) {
  return (
    <div onClick={() => props.setActiveService(props.name)}>
        <Tooltip title={props.name} arrow placement="right">
            <ServiceIcon src={props.icon} />
        </Tooltip>
    </div>
  );
}

export default Service;
