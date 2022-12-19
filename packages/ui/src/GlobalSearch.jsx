import { useCallback, useEffect, useState, useContext } from "react";

import {
  makeStyles,
  Typography,
  Dialog,
  DialogContent,
} from "@material-ui/core";
import { Search as SearchIcon, ArrowDropDown } from "@material-ui/icons";

import AutocompleteSearch from "./AutocompleteSearch";
import SearchRecentItem from "./Search/SearchRecentItem";
import SearchLoadingState from "./Search/SearchLoadingState";
import { SearchContext } from "./Search/SearchContext";

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
    // border: "1px solid rgba(224, 227, 231, 0.8)",
    border: "1px solid #ffffff49",
    // backgroundColor: "rgba(255, 255, 255, 0.6)",
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
        // height: "inherit",
        // height: "min-content",
        height: "inherit",
        maxHeight: "55vh",
        // height: "fit-content",
        // height: "500px",
        margin: " 0.5rem 0.968rem",
        borderRadius: "5px",
        "& .MuiDialogContent-root": {
          padding: "8px 0 !important",
        },
      },
    },
  },
}));

function GlobalSearch() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setLoading(false);
    setInputValue("");
  };
  const handleOpen = () => setOpen(true);

  const handleKeyPress = useCallback((event) => {
    if (event.metaKey === true && event.keyCode === 75) handleOpen();
  }, []);

  const { loading, inputValue, setLoading, setInputValue } =
    useContext(SearchContext);

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
        <SearchIcon className={classes.searchIcon} />
        <Typography className={classes.searchButtonText} variant="body1">
          {/* <strong> Search... </strong> */}
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
          <AutocompleteSearch closeModal={handleClose} />
          {/* {!inputValue && <SearchRecentItem closeModal={handleClose} />} */}
          {/* <SearchRecentItem /> */}
          {inputValue && loading && <SearchLoadingState />}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default GlobalSearch;
