import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import React from "react";
import styled from "styled-components";

export const PositiveFeedback = styled.div`
  color: green;
`;

export const NegativeFeedback = styled.div`
  color: red;
`;

export default function FocusGrade(props) {
    return (
        props.goodGrade ? (
        <PositiveFeedback>
            <h2 style={{ fontWeight: "bold" }}>You did great. Keep it up.</h2>
            <ThumbUpIcon style={{ width: "3em", height: "3em"}}/>
        </PositiveFeedback>
        ) : (
        <NegativeFeedback>
            <h2 style={{ fontWeight: "bold" }}>
                You were pretty distracted in the last focus session. Next time try not to check your messages so much!
            </h2>
            <ThumbDownIcon style={{ width: "3em", height: "3em"}}/>
        </NegativeFeedback>
    ));
}