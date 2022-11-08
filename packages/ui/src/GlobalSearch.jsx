import { useCallback, useEffect, useRef } from "react";

import { makeStyles, Typography } from "@material-ui/core";
import { Search as SearchIcon, ArrowDropDown } from "@material-ui/icons";

import SearchModalContent from "./ChildComponents/SearchModalContent";

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
}));

function GlobalSearch({ searchQuery }) {
  const classes = useStyles();
  const modalRef = useRef(null);

  const handleKeyPress = useCallback((event) => {
    if (event.metaKey === true && event.keyCode === 75) modalRef.current.handleOpen();
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
        onClick={()=>modalRef.current.handleOpen()}
      >
        <SearchIcon className={classes.searchIcon} />
        <Typography>Search...</Typography>
        {/* <Typography variant="subtitle2">cmd+k</Typography> */}
      </button>

      <SearchModalContent searchQuery={searchQuery} ref={modalRef} />
    </>
  );
}

export default GlobalSearch;
