import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
    root: {
        width: 300,
        height: 350,
        backgroundColor: 'white',
        textAlign: 'center',
    },
}));

export default function TodoList(props) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([0]);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleDelete = (task) => {
        const currentIndex = props.todoList.indexOf(task);
        console.log("Delete ", currentIndex, ": ", task);
        props.deleteTodos(currentIndex);
    };

    return (
        <List className={classes.root} dense>
            <h2 style={{margin: "0px 15px"}}>To Do List</h2>
            {props.todoList.length > 0 ? (
                props.todoList.map((task) => {
                        const labelId = `checkbox-list-label-${task}`;
                        return (
                            <ListItem key={task} role={undefined} dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={checked.indexOf(task) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{'aria-labelledby': labelId}}
                                        onClick={handleToggle(task)}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={task}/>
                                {props.hideDelete ? null :
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(task)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </ListItemSecondaryAction>}
                            </ListItem>
                        );
                    }
                )) : <p>No goals added yet. ;)</p>}
        </List>
    );
}