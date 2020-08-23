import React, { useState, useEffect } from "react";
import serviceDefaults from "../../serviceDefaults";
import styled from "styled-components";
import Colors from "../Colors";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";

export const AddServiceDiv = styled.div`
  position: fixed;
  z-index: 150;
  height: 100vh;
  width: 100%;
  background: ${Colors.snow};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  div{
    border:1px solid black;
    width:60%;
    text-align:center;
    padding:20px;
    margin: 0.5px auto;
  }
  div:hover{
    cursor:pointer;
    background-color:${Colors.turquoise};
    color:black;
  }
  .close{
    background-color:${Colors.navy};
    color:white;
  }
`;

export default function AddService(props) {
  const services = Object.keys(serviceDefaults);

    return (
        <AddServiceDiv>
            <div onClick={props.closeAddingApp} className="close">close</div>
            {services.map((service) => (
                <div key={service} onClick={() => props.addApp(service)}>
                    {service}
                </div>
            ))}
        </AddServiceDiv>
    );
    {/*<Dialog
            onClose={props.closeAddingApp}
            aria-labelledby="simple-dialog-title"
            open={true}
        >
            <DialogTitle id="simple-dialog-title">Add an App</DialogTitle>
            <ButtonGroup
                orientation="vertical"
                color="primary"
                aria-label="vertical contained primary button group"
                variant="contained"
            >
                {services.map((service) => (
                    <Button key={service} onClick={() => props.addApp(service)}>
                        {service}
                    </Button>
                ))}
            </ButtonGroup>
        </Dialog>
    );*/}
}
