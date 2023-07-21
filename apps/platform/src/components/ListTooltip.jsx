import {Paper, List, ListItem, ListItemText, Popper, Fade} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { v1 } from 'uuid';

const useStyles = makeStyles(() => ({
  listitem: {
    padding: '0.2rem 0.6rem',
    width: '100%',
  },
  listItemText: {
    fontSize: '0.75rem',
    minWidth: '100%',
  },
}));

function ListTooltip({ dataList, open, anchorEl, container }) {
  const classes = useStyles();
  return (
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
        // TODO: review props spreading
        // eslint-disable-next-line
        <Fade {...TransitionProps} timeout={350}>
          <Paper>
            <List dense>
              {dataList.map(d => (
                <ListItem key={v1()} className={classes.listitem}>
                  <ListItemText
                    primary={d.label}
                    secondary={d.value}
                    className={classes.listItemText}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}

export default ListTooltip;
