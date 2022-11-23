import { useCallback, useEffect, useState } from "react";

import {
  makeStyles,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { Search as SearchIcon, ArrowDropDown } from "@material-ui/icons";

import UseAutocomplete from "./UseAutocomplete";
import SearchRecentItem from "./ChildComponents/SearchRecentItem";

const useStyles = makeStyles((theme) => ({
  searchButton: {
    background: "#ffffff6e",
    width: "80%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: 0,
    borderRadius: "0.3rem",
    "&:hover": {
      cursor: "pointer",
    },
  },
  searchIcon: {
    color: "white",
    marginLeft: "1rem",
  },
  searchButtonText: {
    color: "white",
  },
  modal: {
    "& .MuiDialog-scrollPaper": {
      alignItems: "start",
      "& .MuiDialog-paperWidthSm": {
        width: "80vw",
        maxWidth: "700px",
        height: "50vh",
        maxHeight: "80vh",
        margin: " 0.5rem 0.968rem",
        borderRadius: "12px",
      },
    },
  },
}));

function GlobalSearch({ searchQuery }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleKeyPress = useCallback((event) => {
    if (event.metaKey === true && event.keyCode === 75) handleOpen();
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
        <Typography className={classes.searchButtonText} variant="body1"><strong> Search... </strong></Typography>
        <Typography className={classes.searchButtonText} variant="subtitle2"> (cmd+k)</Typography>
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
          <UseAutocomplete searchQuery={searchQuery} />
          <SearchRecentItem/>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default GlobalSearch;
