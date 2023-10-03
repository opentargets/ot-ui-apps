import { useEffect, forwardRef, useContext } from "react";
import { Box, Grow, styled, alpha } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import GlobalSearchDialog from "./GlobalSearchDialog";
import { SearchContext } from "./SearchContext";

const SearchButton = styled("button")(({ theme }) => ({
  cursor: "pointer",
  width: "100%",
  maxWidth: "400px",
  background: alpha("#fff", 0.3),
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(0.6),
  padding: `${theme.spacing(0.4)} ${theme.spacing(1.2)}`,
  color: "white",
}));

function GlobalSearch() {
  const { setOpen } = useContext(SearchContext);
  const shortcutText =
    navigator?.platform.indexOf("Mac") > -1 ? "⌘ K" : "Ctrl+K";

  function monitorCmdK(event) {
    // open on cmd + k
    if (event.metaKey === true && event.code === "KeyK") {
      event.stopPropagation();
      event.preventDefault();
      setOpen(true);
    }
  }

  console.log("global search");

  useEffect(() => {
    document.addEventListener("keydown", monitorCmdK);
    return () => {
      document.removeEventListener("keydown", monitorCmdK);
    };
  }, []);

  return (
    <Box sx={{ width: 1, display: "flex", justifyContent: "center" }}>
      <SearchButton
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: (theme) => theme.spacing(2),
          }}
        >
          <Box>
            <FontAwesomeIcon icon={faMagnifyingGlass} size="xs" />
          </Box>
          Search...
          <Box
            sx={{
              fontSize: (theme) => theme.spacing(1.3),
              fontWeight: "bold",
              color: "white",
              backgroundColor: (theme) => theme.palette.primary.main,
              padding: (theme) => `${theme.spacing(0.5)} ${theme.spacing(1)}`,
              borderRadius: (theme) => theme.spacing(0.4),
            }}
          >
            {shortcutText}
          </Box>
        </Box>
      </SearchButton>

      {/* <Grow > */}
      <GlobalSearchDialog />
      {/* </Grow> */}
    </Box>
  );
}

export default GlobalSearch;
