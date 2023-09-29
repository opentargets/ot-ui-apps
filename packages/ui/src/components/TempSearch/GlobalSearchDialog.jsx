import { useContext, useState } from "react";
import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";
import useListOption from "../../hooks/useListOption";
import GlobalSearchInput from "./GlobalSearchInput";
import GlobalSearchList from "./GlobalSearchList";
import { SearchContext } from "../Search/SearchContext";

function GlobalSearchDialog() {
  const [openListItem] = useListOption();
  const [inputValue, setInputValue] = useState("");
  const { open, setOpen } = useContext(SearchContext);

  console.log("- dialog rerender");

  function handleChangeSelected(direction) {
    console.log(
      `👻 ~ file: GlobalSearchDialog.jsx:8 ~ handleChangeSelected ~ direction:`,
      direction
    );
    const items = document.querySelectorAll(".search-list-item");

    let index = 0;
    let newIndex = 0;

    if (direction === "down") {
      items.forEach((_, i) => {
        // if (i === selected) {
        //   index = i;
        // }
      });

      newIndex = index === items.length - 1 ? 0 : index + 1;
    } else if (direction === "up") {
      items.forEach((_, i) => {
        // if (i === selected) {
        //   index = i;
        // }
      });

      newIndex = !index ? items.length - 1 : index - 1;
    } else {
      //   setSelected(0);
    }

    const newItem = items[newIndex];

    if (newItem && typeof newIndex === "number") {
      //   setSelected(newIndex);
      newItem.scrollIntoView({
        behavior: "smooth",
        block: newIndex ? "center" : "end",
      });
    }
  }

  //   function handleSelect(item) {
  function handleSelect() {
    console.log("enter");
    const item = {};
    // openListItem(item);
  }

  return (
    <Dialog
      open={open}
      role="searchbox"
      scroll="paper"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.code === "ArrowDown") {
          e.preventDefault();
          e.stopPropagation();
          handleChangeSelected("down");
        } else if (e.code === "ArrowUp") {
          e.preventDefault();
          e.stopPropagation();
          handleChangeSelected("up");
        } else if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          handleSelect();
        }
      }}
    >
      <DialogTitle>
        <GlobalSearchInput
          inputValue={inputValue}
          onInputValueChange={(e) => setInputValue(e)}
          setOpen={setOpen}
        />
      </DialogTitle>
      <DialogContent dividers>
        <GlobalSearchList inputValue={inputValue.trim()} />
      </DialogContent>
    </Dialog>
  );
}

export default GlobalSearchDialog;
