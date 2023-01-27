import { useState, useEffect, useContext } from "react";
import { Search } from "@material-ui/icons";
import {
  makeStyles,
  TextField,
  InputBase,
  InputAdornment,
} from "@material-ui/core";
import useDebounce from "../hooks/useDebounce";
import { SearchContext } from "./SearchContext";

const useStyles = makeStyles((theme) => ({
  searchIcon: {
    color: theme.palette.primary.main,
    marginRight: "0.6rem",
    fontSize: "1.6rem",
  },
  escButton: {
    cursor: "pointer",
    alignSelf: "center",
    margin: "0 10px",
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
    border: "0 !important",
    color: "grey",
    font: "inherit",
    height: "100%",
    outline: "none",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1.2rem",
    alignItems: "center",
    paddingBottom: "0.4rem",
  },
  inputPadding: {
    padding: "0 1rem 0.5rem 1rem",
  },
}));

function SearchInput({
  params,
  debounceValue,
  onClose,
  changeInputValue,
  isHomePage,
}) {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 300);
  const {
    searchPlaceholder
  } = useContext(SearchContext);

  const handleChangeInputValue = (e) => {
    setInputValue(e.target.value.trim() || "");
    changeInputValue(e.target.value.trim() || "");
  };

  useEffect(() => {
    debounceValue(debouncedInputValue);
  }, [debouncedInputValue]);

  return (
    <div className={classes.searchContainer}>
      <TextField
        autoFocus={!isHomePage}
        className={classes.searchInput}
        {...params}
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <Search className={classes.searchIcon} />
            </InputAdornment>
          ),
          endAdornment: !isHomePage && (
            <InputAdornment position="end">
              <button className={classes.escButton} onClick={onClose}>
                esc
              </button>
            </InputAdornment>
          ),
          className: classes.inputPadding,
        }}
        onChange={handleChangeInputValue}
        value={inputValue}
        placeholder={searchPlaceholder}
      />
    </div>
  );
}

export default SearchInput;
