import { useEffect, useState, forwardRef } from "react";
import { Box, Grow } from "@mui/material";

import GlobalSearchDialog from "./GlobalSearchDialog";

function GlobalSearch() {
  const [open, setOpen] = useState(false);


  console.log('global search rerender');

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
      <GlobalSearchDialog open={open} setOpen={setOpen}/>
      {/* </Grow> */}
    </Box>
  );
}

export default GlobalSearch;
