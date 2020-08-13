import React from "react";
import styled from 'styled-components';

export const ServiceIcon = styled.img`
  width: 50px;
  margin: 0.5rem 1rem;
`;

function Service(props) {
  return (
    <div onClick={() => props.setActiveService(props.name)}>
      <ServiceIcon src={props.icon} />
    </div>
  );
}

export default Service;
