import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Drawer, IconButton, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ReactNode, useState } from "react";
import DownloadsSchemaBuilder from "./DownloadsSchemaBuilder";
import { buildSchema } from "./utils";
import { OtTable } from "ui";

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
    width: "720px",
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

function DownloadsSchemaDrawer({ children, data }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  function toggleOpen() {
    setOpen(!open);
  }

  function close() {
    setOpen(false);
  }

  // const { schema } = buildSchema(data);

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
          schema
          <IconButton onClick={() => close()}>
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </Typography>

        <Paper className={classes.paper} variant="outlined">
          <Typography sx={{ textTransform: "capitalize" }} variant="h6" gutterBottom>
            {data["@id"]}
          </Typography>
          {/* <div className={classes.resourceURL}> */}
          <code>
            {/* <pre>{schema}</pre> */}
            <DownloadsSchemaBuilder data={data} />
          </code>
          {/* </div> */}
        </Paper>
      </Drawer>
    </span>
  );
}

export default DownloadsSchemaDrawer;
