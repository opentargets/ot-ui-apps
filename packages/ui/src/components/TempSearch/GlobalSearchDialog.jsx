import { useCallback, useContext, useEffect, useState } from "react";
import { Box, Dialog, DialogContent, DialogTitle, styled } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import GlobalSearchList from "./GlobalSearchList";
import { SearchContext, SearchInputProvider } from "./SearchContext";
import GlobalSearchInput from "./GlobalSearchInput";
import GlobalSearchFreeListItem from "./GlobalSearchFreeListItem";

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

function GlobalSearchDialog() {
  const { open, setOpen } = useContext(SearchContext);
  const [inputValue, setInputValue] = useState("");
  let selected = 0;

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
      <SearchInputProvider setValue={setInputValue}>
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
              <GlobalSearchInput />
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
          <GlobalSearchFreeListItem />
          <GlobalSearchList inputValue={inputValue} />
        </DialogContent>
      </SearchInputProvider>
    </Dialog>
  );
}

export default GlobalSearchDialog;
