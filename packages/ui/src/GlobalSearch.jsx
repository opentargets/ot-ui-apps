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

const useStyles = makeStyles((theme) => ({
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
  modal: {
    "& .MuiDialog-scrollPaper": {
      justifyContent: "end",
      alignItems: "start",
      "& .MuiDialog-paperWidthSm": {
        width: "40vw",
        maxWidth: "700px",
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
        <Typography>Search...</Typography>
        {/* <Typography variant="subtitle2">cmd+k</Typography> */}
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
        </DialogContent>
      </Dialog>
    </>
  );
}

export default GlobalSearch;
