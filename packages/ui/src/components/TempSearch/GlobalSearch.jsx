import { useEffect, forwardRef, useContext } from "react";
import { Box, Grow } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

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
      <Box>
        <button
          type="button"
          onClick={() => {
            setOpen(true);
          }}
        >
          <Box>
            <FontAwesomeIcon icon={faMagnifyingGlass} size="xs" />
          </Box>
          search button
          <Box>cmdk button</Box>
        </button>
      </Box>

      {/* <Grow > */}
      <GlobalSearchDialog />
      {/* </Grow> */}
    </Box>
  );
}

export default GlobalSearch;
