import { useEffect, forwardRef, useContext } from "react";
import { Box, Grow } from "@mui/material";

import GlobalSearchDialog from "./GlobalSearchDialog";
import { SearchContext } from "../Search/SearchContext";

function GlobalSearch() {
  const { setOpen } = useContext(SearchContext);

  console.log("global search rerender");

  function monitorCmdK(event) {
    // open on cmd + k
    if (event.metaKey === true && event.code === "KeyK") {
      event.stopPropagation();
      event.preventDefault();
      setOpen(true);
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", monitorCmdK);
    return () => {
      document.removeEventListener("keydown", monitorCmdK);
    };
  }, []);

  return (
    <Box>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        search button
      </button>

      {/* <Grow > */}
      <GlobalSearchDialog />
      {/* </Grow> */}
    </Box>
  );
}

export default GlobalSearch;
