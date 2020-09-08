import React, {useState} from "react";
import Fab from "@material-ui/core/Fab";
import FilterCenterFocusIcon from '@material-ui/icons/FilterCenterFocus';


function FocusBubble(props) {
    return (
        <Fab>
            <FilterCenterFocusIcon />
        </Fab>
    );

}

export default FocusBubble;