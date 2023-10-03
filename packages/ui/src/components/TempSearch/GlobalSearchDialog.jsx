import { useCallback, useContext, useEffect, useState } from "react";
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
import ArrowTurnDownLeft from "../../components/icons/ArrowTurnDownLeft";
import GlobalSearchInput from "./GlobalSearchInput";
import useListOption from "../../hooks/useListOption";

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
  const { open, setOpen } = useContext(SearchContext);
  const [inputValue, setInputValue] = useState("");
  let selected = 0;
  // const inputValue = useDebounce(inputValue, 300);
  const [openListItem] = useListOption();
  const freeSearchTermObject = {
    symbol: `Search for: ${inputValue}`,
    name: inputValue,
    entity: "search",
    type: "",
  };

  console.log(" dialog rerender");

  function handleChangeSelected(direction) {
    const items = document.querySelectorAll(".search-list-item");

    let index = 0;
    let newIndex = 0;

    if (direction === "down") {
      items.forEach((_, i) => {
        if (i === selected) {
          index = i;
        }
      });

      newIndex = index === items.length - 1 ? 0 : index + 1;
    } else if (direction === "up") {
      items.forEach((_, i) => {
        if (i === selected) {
          index = i;
        }
      });

      newIndex = !index ? items.length - 1 : index - 1;
    } else {
      selected = 0;
    }

    const newItem = items[newIndex];

    if (newItem && typeof newIndex === "number") {
      selected = newIndex;
      items.forEach((el) => {
        el.classList.remove("search-list-item-active");
      });
      newItem.classList.add("search-list-item-active");
      newItem.scrollIntoView({
        behavior: "smooth",
        block: newIndex ? "center" : "end",
      });
    }
    console.log(
      `👻 ~ file: GlobalSearchDialog.jsx:110 ~ handleChangeSelected ~ items:`,
      items
    );
  }

  // function handleSelect() {
  // }

  const onKeyDownHandler = useCallback((e) => {
    if (e.key === "Escape") {
      setOpen(false);
      e.preventDefault();
      e.stopPropagation();
      // onInputValueChange("");
    } else if (e.code === "ArrowDown") {
      handleChangeSelected("down");
      e.preventDefault();
      e.stopPropagation();
    } else if (e.code === "ArrowUp") {
      handleChangeSelected("up");
      e.preventDefault();
      e.stopPropagation();
    } else if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDownHandler);
    return () => {
      document.removeEventListener("keydown", onKeyDownHandler);
    };
  }, []);

  const handleItemClick = useCallback((item) => {
    setOpen(false);
    openListItem(item);
  }, []);

  return (
    <Dialog
      open={open}
      role="searchbox"
      scroll="paper"
      tabIndex={0}
      onClose={() => {
        setOpen(false);
      }}
      sx={{
        "& .MuiDialog-container": {
          alignItems: "start",
          "& .MuiPaper-root": {
            width: "80vw",
            maxWidth: "800px",
            borderRadius: (theme) => theme.spacing(1),
            margin: (theme) => theme.spacing(6),
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
            <GlobalSearchInput setValue={setInputValue} />
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
            className="search-list-item search-list-item-active"
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
        <GlobalSearchList inputValue={inputValue} />
      </DialogContent>
    </Dialog>
  );
}

export default GlobalSearchDialog;
