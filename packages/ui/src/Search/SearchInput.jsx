import { useState, useEffect } from "react";
import { Search as SearchIcon, ArrowDropDown } from "@material-ui/icons";
import { makeStyles, TextField } from "@material-ui/core";
import useDebounce from "../hooks/useDebounce";

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
    padding: "0 0 0 8px",
    
    "& .MuiFormControl-root": {
      border: "0 !important",
      '&:hover': {
        border: "0 !important",
      },
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
    border: "0 !important",
    },
    "& .MuiInput-underline:after": {
      border: "0 !important",
      },
      "& .MuiInput-underline:before": {
      border: "0 !important",

      }
  },
  searchContainer: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "1.2rem",
    alignItems: "center",
    paddingBottom: "0.4rem",
    borderBottom: "0.1px solid #00000061",
  },
}));

function SearchInput({ params, searchQueryInput, onClose }) {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 300);

  const handleChangeInputValue = (e) => {
    setInputValue(e.target.value || "");
  };

  useEffect(() => {
    searchQueryInput(debouncedInputValue);
    console.log(inputValue);
  }, [debouncedInputValue])
  

  return (
    <div className={classes.searchContainer} >
      <SearchIcon className={classes.searchIcon} />
      <TextField
            autoFocus
            className={classes.searchInput}
            onChange={handleChangeInputValue}
            value={inputValue}
            placeholder="Search..."
            fullWidth
            variant="standard"
            // InputProps={{ ...params.InputProps, type: 'search' }}
            {...params}
          />
      <button className={classes.escButton} onClick={onClose}>
        esc
      </button>
    </div>
  );
}

export default SearchInput;
