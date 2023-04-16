import React from 'react';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import { withStyles } from '@mui/styles';

const styles = theme => ({
  listitem: {
    padding: '0.2rem 0.6rem',
    width: '100%',
  },
  listitemtext: {
    fontSize: '0.75rem',
    minWidth: '100%',
  },
});

const ListTooltip = ({ classes, dataList, open, anchorEl, container }) => (
  <Popper
    open={open}
    anchorEl={anchorEl}
    container={container}
    transition
    placement="top"
    modifiers={{
      preventOverflow: {
        enabled: true,
        boundariesElement: 'window',
      },
    }}
  >
    {({ TransitionProps }) => (
      <Fade {...TransitionProps} timeout={350}>
        <Paper>
          <List dense>
            {dataList.map((d, i) => (
              <ListItem key={i} className={classes.listitem}>
                <ListItemText
                  primary={d.label}
                  secondary={d.value}
                  className={classes.listitemtext}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Fade>
    )}
  </Popper>
);

export default withStyles(styles)(ListTooltip);
