import { useState } from "react";
import { Search as SearchIcon, ArrowDropDown } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  searchIcon: {
    color: theme.palette.primary.main,
    marginRight: "0.6rem",
    fontSize: "1.6rem",
  },
  escButton: {
    cursor: "pointer",
    alignSelf: "center",
    marginRight: "10px",
    padding: "0.1rem 0.8rem 0.2rem",
    borderRadius: "5px",
    color: "#fff",
    border: "1px solid " + theme.palette.primary.main,
    backgroundColor: theme.palette.primary.main,
    fontSize: "1.2rem",
  },
  searchInput: {
    width: "100%",
    appearance: "none",
    background: "transparent",
    border: 0,
    color: "grey",
    font: "inherit",
    
    height: "100%",
    outline: "none",
    padding: "0 0 0 8px",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1.2rem",
  },
}));

function GlobalSearchModalInput({ searchQueryInput, onClose }) {
  const [inputValue, setInputValue] = useState("");
  const classes = useStyles();

  const handleChangeInputValue = (e) => {
    setInputValue(e.target.value || "");
    searchQueryInput(e.target.value);
  };

  return (
    <div className={classes.searchContainer}>
      <SearchIcon className={classes.searchIcon} />
      <input
        className={classes.searchInput}
        type="text"
        placeholder="Search..."
        onChange={handleChangeInputValue}
        value={inputValue}
      />
      <button className={classes.escButton} onClick={onClose}>
        esc
      </button>
    </div>
  );
}

export default GlobalSearchModalInput;
