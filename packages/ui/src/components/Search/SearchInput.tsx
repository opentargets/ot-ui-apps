import { useEffect, useContext, useRef } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { makeStyles } from "@mui/styles";
import { TextField, InputAdornment, TextFieldProps } from "@mui/material";
import useDebounce from "../../hooks/useDebounce";
import { SearchContext } from "./SearchContext";

const useStyles = makeStyles((theme) => ({
  searchIcon: {
    color: theme.palette.primary.main,
    marginRight: "0.6rem",
    fontSize: "1.3rem",
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
  onClose,
  isHomePage,
  focus = true,
  setOpen,
}: {
  params: TextFieldProps;
  onClose: () => void;
  isHomePage?: boolean;
  focus: boolean;
  setOpen: (value: boolean) => void;
}) {
  const classes = useStyles();
  const { searchPlaceholder } = useContext(SearchContext);
  const inputRef = useRef<HTMLInputElement>(null);

  console.log('inpi=uttt')

  useEffect(() => {
    if (inputRef.current && (!isHomePage || focus)) {
      inputRef.current.focus();
    }
  }, [focus]);

  return (
    <div className={classes.searchContainer}>
      <TextField
        inputRef={inputRef}
        className={classes.searchInput}
        variant="standard"
        {...params}
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className={classes.searchIcon}
                size="xs"
              />
            </InputAdornment>
          ),
          endAdornment: !isHomePage && (
            <InputAdornment position="end">
              <button
                type="button"
                className={classes.escButton}
                onClick={onClose}
              >
                esc
              </button>
            </InputAdornment>
          ),
          className: classes.inputPadding,
        }}
        placeholder={searchPlaceholder}
        onKeyDown={(e) => {
          if (e.code === "Escape") onClose();
        }}
        onBlur={() => {
          onClose();
        }}
        onFocus={() => {
          setOpen(true);
        }}
      />
    </div>
  );
}

export default SearchInput;
