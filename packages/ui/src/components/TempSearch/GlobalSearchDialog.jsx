import { useCallback, useContext, useState } from "react";
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
import useListOption from "../../hooks/useListOption";

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

const FreeSearchListItem = styled("li")(({ theme }) => ({
  cursor: "pointer",
  width: "100%",
  listStyle: "none",
  padding: `${theme.spacing(1.5)}`,
  borderRadius: theme.spacing(0.5),
  color: theme.palette.grey["900"],
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  wordBreak: "break-word",
  "&:hover": {
    background: theme.palette.grey["200"],
  },
}));

const SearchListItemText = styled("span")({
  maxWidth: "90%",
});



function GlobalSearchDialog() {
  const { open, setOpen, searchPlaceholder } = useContext(SearchContext);
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 300);
  const [openListItem] = useListOption();
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

  const handleItemClick = useCallback((item) => {
    setOpen(false);
    openListItem(item);
  }, []);

  return (
    <Dialog
      onClose={() => {
        setOpen(false);
      }}
      open={open}
      role="searchbox"
      scroll="paper"
      tabIndex={0}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "80vw",
            maxWidth: "800px", 
          },
        },
      }}
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
          <FreeSearchListItem
            className="search-list-item"
            role="menuitem"
            tabIndex="0"
            onClick={() => handleItemClick(freeSearchTermObject)}
          >
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
