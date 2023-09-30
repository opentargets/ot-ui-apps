import { useContext, useState } from "react";
import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material";
import GlobalSearchInput from "./GlobalSearchInput";
import GlobalSearchList from "./GlobalSearchList";
import { SearchContext } from "../Search/SearchContext";
import { InputValueContextProvider } from "./Context/GlobalSearchSelectContext";

function GlobalSearchDialog() {
  const { open, setOpen } = useContext(SearchContext);

  return (
    <InputValueContextProvider>
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
          <GlobalSearchInput setOpen={setOpen} />
        </DialogTitle>
        <DialogContent dividers>
          <GlobalSearchList />
        </DialogContent>
      </Dialog>
    </InputValueContextProvider>
  );
}

export default GlobalSearchDialog;
