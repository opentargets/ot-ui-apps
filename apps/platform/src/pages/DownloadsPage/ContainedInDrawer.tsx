import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Drawer, IconButton, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";

const useStyles = makeStyles(theme => ({
  backdrop: {
    "& .MuiBackdrop-root": {
      opacity: "0 !important",
    },
  },
  container: {
    backgroundColor: theme.palette.grey[300],
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderBottom: "1px solid #ccc",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "1rem",
  },
  paper: {
    width: "420px",
    margin: "1.5rem",
    padding: "1rem",
  },
  resourceURL: {
    marginBottom: "8px",
    padding: "10px",
    wordBreak: "break-all",
    backgroundColor: theme.palette.grey[800],
    color: "white",
  },
  ftpURL: {
    color: "white",
    textDecoration: "none",
  },
}));

function ContainedInDrawer({ title, link, children, location }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  function toggleOpen() {
    setOpen(!open);
  }

  function close() {
    setOpen(false);
  }

  return (
    <span>
      <span onClick={() => toggleOpen()}>{children}</span>
      <Drawer
        classes={{ root: classes.backdrop, paper: classes.container }}
        open={open}
        onClose={() => close()}
        anchor="right"
      >
        <Typography className={classes.title}>
          {title}
          <IconButton onClick={() => close()}>
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </Typography>

        <Paper className={classes.paper} variant="outlined">
          {/* <Typography variant="h6" gutterBottom>
            {formatMap[format]} Data Format
             Data Format
          </Typography> */}
          <Typography variant="subtitle2" gutterBottom>
            {location} format (link)
          </Typography>
          <div className={classes.resourceURL}>
            <a className={classes.ftpURL} href={link}>
              {link}
            </a>
          </div>
        </Paper>
      </Drawer>
    </span>
  );
}
export default ContainedInDrawer;
