import { useCallback, useEffect, useState, useContext } from "react";
import { makeStyles } from "@mui/styles";
import { Typography, Dialog, DialogContent } from "@mui/material";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AutocompleteSearch from "./AutocompleteSearch";

const useStyles = makeStyles((theme) => ({
  searchButton: {
    background: "#ffffff4e",
    width: "80%",
    maxWidth: "60vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: 0,
    borderRadius: "0.3rem",
    "&:hover": {
      cursor: "pointer",
    },
    position: "relative",
  },
  searchIcon: {
    color: "white",
    margin: "0 0.8rem",
    opacity: 0.8,
    width: "20px",
  },
  searchButtonText: {
    color: "white",
    opacity: 0.8,
  },
  command: {
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "#fff",
    marginLeft: "4px",
    border: "1px solid #ffffff49",
    backgroundColor: theme.palette.primary.main,
    padding: "2px 4px",
    borderRadius: "5px",
    position: "absolute",
    right: "10px",
  },
  modal: {
    "& .MuiDialog-scrollPaper": {
      alignItems: "start",
      "& .MuiDialog-paperWidthSm": {
        width: "80vw",
        maxWidth: "800px",
        minHeight: "55vh",
        height: "600px",
        maxHeight: "90vh",
        margin: " 0.5rem 0.968rem",
        overflow: "hidden",
        borderRadius: "5px",
        "& .MuiDialogContent-root": {
          padding: "8px 0 !important",
        },
      },
    },
  },
}));

function GlobalSearch({ showSearchResultPage }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    // setLoading(false);
  };
  const handleOpen = () => setOpen(true);

  const handleKeyPress = useCallback((event) => {
    // open on cmd + k
    if (event.metaKey === true && event.keyCode === 75) {
      event.stopPropagation();
      event.preventDefault();
      handleOpen();
      return false;
    }
    // close on esc
    if (event.keyCode === 27) {
      event.stopPropagation();
      event.preventDefault();
      handleClose();
      return false;
    }
  }, []);

  console.log('inside global search popup')

  const shortcutText =
    navigator?.platform.indexOf("Mac") > -1 ? "⌘ K" : "Ctrl+K";

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
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className={classes.searchIcon}
        />
        <Typography className={classes.searchButtonText} variant="body1">
          Search...
        </Typography>
        <div className={classes.command}>{shortcutText}</div>
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        className={classes.modal}
      >
        <DialogContent>
          <AutocompleteSearch
            closeModal={handleClose}
            showSearchResultPage={showSearchResultPage}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default GlobalSearch;
