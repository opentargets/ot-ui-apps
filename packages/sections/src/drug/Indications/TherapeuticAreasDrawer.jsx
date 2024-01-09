import { useState } from "react";
import { Link } from "ui";
import {
  Box,
  Drawer,
  IconButton,
  Link as MUILink,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const therapeuticAreasDrawerStyles = makeStyles(theme => ({
  drawerBody: {
    overflowY: "overlay",
  },
  drawerBodyPaperRoot: {
    border: "1px solid #ccc",
    margin: "1rem 1rem 0 1rem",
    padding: "1rem",
    "&::before": {
      backgroundColor: "transparent",
    },
  },
  drawerLink: {
    cursor: "pointer",
  },
  drawerModal: {
    "& .MuiBackdrop-root": {
      opacity: "0 !important",
    },
  },
  drawerPaper: {
    backgroundColor: theme.palette.grey[300],
  },
  drawerTitle: {
    borderBottom: "1px solid #ccc",
    padding: "1rem",
  },
  drawerTitleCaption: {
    color: theme.palette.grey[700],
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  drawerSubtitleCaption: {
    color: theme.palette.grey[400],
    fontSize: "0.8rem",
    fontStyle: "italic",
  },
}));

function TherapeuticAreasDrawer({ therapeuticAreas }) {
  const [open, setOpen] = useState(false);
  const classes = therapeuticAreasDrawerStyles();

  if (therapeuticAreas.length === 0) {
    return "N/A";
  }

  if (therapeuticAreas.length === 1) {
    return <Link to={`/disease/${therapeuticAreas[0].id}`}>{therapeuticAreas[0].name}</Link>;
  }

  const toggleDrawer = event => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  const drawerContent = (
    <>
      <Paper classes={{ root: classes.drawerTitle }} elevation={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" flexDirection="column">
            <Typography className={classes.drawerTitleCaption}>Therapeutic Areas</Typography>
            <Typography className={classes.drawerSubtitleCaption}>
              {therapeuticAreas.length} entries
            </Typography>
          </Box>
          <IconButton onClick={closeDrawer}>
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </Box>
      </Paper>

      <Box className={classes.drawerBody}>
        <Paper
          elevation={0}
          classes={{
            root: classes.drawerBodyPaperRoot,
          }}
        >
          <List>
            {therapeuticAreas.map(item => (
              <ListItem key={item.id}>
                <Link to={`/disease/${item.id}`}>{item.name}</Link>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </>
  );

  return (
    <>
      <MUILink underline="none" onClick={toggleDrawer} className={classes.drawerLink}>
        {therapeuticAreas.length} areas
      </MUILink>

      <Drawer
        anchor="right"
        classes={{ modal: classes.drawerModal, paper: classes.drawerPaper }}
        open={open}
        onClose={closeDrawer}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export default TherapeuticAreasDrawer;
