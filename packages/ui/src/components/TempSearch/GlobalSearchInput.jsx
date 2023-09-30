import { memo, useContext, useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Box, styled } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchContext } from "../Search/SearchContext";
import { InputValueContext } from "./Context/GlobalSearchSelectContext";

const SearchInput = styled("input")(({ theme }) => ({
  borderColor: "transparent",
  padding: `0 ${theme.spacing(1)}`,
  fontSize: theme.spacing(3),
  color: theme.palette.grey[700],
  width: "100%",
  "&:focus": {
    outline: "none",
  },
  "&::placeholder": {
    color: theme.palette.grey[400],
  },
}));

const EscButton = styled("button")(({ theme }) => ({
  display: "block",
  alignSelf: "center",
  cursor: "pointer",
  padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
  margin: `0 ${theme.spacing(0.5)}`,
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.grey[100],
  border: `1px solid ${theme.palette.grey[400]}`,
  "&:hover": {
    border: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: `${theme.palette.primary.main.light}`,
  },
}));

function GlobalSearchInput({ setOpen }) {
  const { searchPlaceholder } = useContext(SearchContext);
  const [inputValue, setInputValue] = useContext(InputValueContext);

  function onKeyDownHandler(e) {
    if (e.key === "Escape") {
      setOpen(false);
      e.preventDefault();
      e.stopPropagation();
      // onInputValueChange("");
    } else if (e.code === "ArrowDown") {
      e.preventDefault();
      e.stopPropagation();
    } else if (e.code === "ArrowUp") {
      e.preventDefault();
      e.stopPropagation();
    } else if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          fontSize: (theme) => `${theme.spacing(3.5)}`,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} size="xs" />
      </Box>
      <Box sx={{ display: "flex", flexGrow: "1" }}>
        <SearchInput
          placeholder={searchPlaceholder}
          autoFocus
          value={inputValue}
          type="text"
          onChange={(e) => setInputValue(e.currentTarget.value)}
          onFocus={(e) => {
            e.currentTarget.select();
          }}
          onKeyDown={(e) => {
            onKeyDownHandler(e);
          }}
        />
      </Box>
      <Box>
        <EscButton
          type="button"
          onClick={() => {
            setOpen(false);
          }}
        >
          esc
        </EscButton>
      </Box>
    </Box>
  );
}

export default memo(GlobalSearchInput);
