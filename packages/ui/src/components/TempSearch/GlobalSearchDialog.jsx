import { useContext, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  styled,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import GlobalSearchList from "./GlobalSearchList";
import { SearchContext } from "../Search/SearchContext";
import useDebounce from "../../hooks/useDebounce";
import ArrowTurnDownLeft from "../../components/icons/ArrowTurnDownLeft";

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

const FreeSearchListItem = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
  width: "100%",
  wordBreak: "break-word",
  paddingRight: "0.2rem",
});

const SearchListItemText = styled("span")({
  maxWidth: "90%",
});

function GlobalSearchDialog() {
  const { open, setOpen, searchPlaceholder } = useContext(SearchContext);
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 500);
  const freeSearchTermObject = {
    symbol: `Search for: ${inputValue}`,
    name: inputValue,
    entity: "search",
    type: "",
  };

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
    <Dialog
      onClose={() => {
        setOpen(false);
      }}
      open={open}
      role="searchbox"
      scroll="paper"
      tabIndex={0}
    >
      <DialogTitle>
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
      </DialogTitle>
      <DialogContent dividers>
        {inputValue && (
          <FreeSearchListItem>
            <SearchListItemText>
              <Typography variant="subtitle1">
                <Box sx={{ fontStyle: "oblique" }}>
                  {freeSearchTermObject.symbol}
                </Box>
              </Typography>
            </SearchListItemText>
            <ArrowTurnDownLeft />
          </FreeSearchListItem>
        )}
        <GlobalSearchList inputValue={debouncedInputValue} />
      </DialogContent>
    </Dialog>
  );
}

export default GlobalSearchDialog;
