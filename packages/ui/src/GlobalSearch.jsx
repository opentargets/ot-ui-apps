import { useCallback, useEffect, useState } from "react";

import { Modal, Box, makeStyles, colors, Typography } from "@material-ui/core";
import { Search as SearchIcon, ArrowDropDown } from "@material-ui/icons";
import SearchModalContent from "./ChildComponents/SearchModalContent";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "30vw",
    height: 400,
    background: "white",
    top: `30%`,
    left: `50%`,
    transform: `translate(-30%, -50%)`,
  },
  searchButton: {
    background: "white",
    width: "10vw",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    border: 0,
    "&:hover": {
      cursor: "pointer",
    },
  },
  searchIcon: {
    color: "#3489ca",
    marginRight: "1rem",
  },
}));

function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleKeyPress = useCallback((event) => {
    if (event.metaKey === true && event.keyCode === 75) setOpen(true);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <>
      <button
        type="button"
        className={classes.searchButton}
        onClick={handleOpen}
      >
        <SearchIcon className={classes.searchIcon} />
        <Typography>Search...</Typography>
        <Typography variant="subtitle2">cmd+k</Typography>
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={classes.paper}>
          <SearchModalContent/>
        </div>
      </Modal>
    </>
  );
}

export default GlobalSearch;
