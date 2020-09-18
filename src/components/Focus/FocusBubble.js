import React from "react";
import Fab from "@material-ui/core/Fab";
import FilterCenterFocusIcon from '@material-ui/icons/FilterCenterFocus';

function FocusBubble(props) {
    return (
        <Fab onClick={props.handleClick}
             style={{position: 'fixed', bottom: 50, right: 50, zIndex: 2, height: 85, width: 85}}>
            <FilterCenterFocusIcon style={{height: 40, width: 40}}/>
        </Fab>);
}

export default FocusBubble;