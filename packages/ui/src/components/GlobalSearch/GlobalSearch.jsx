import { useEffect, useContext } from "react";
import { Box, styled } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import GlobalSearchDialog from "./GlobalSearchDialog";
import { SearchContext } from "./SearchContext";

const SearchButton = styled("button")(({ theme, isHomePage = false }) => ({
  cursor: "pointer",
  width: "100%",
  maxWidth: isHomePage ? "90%" : "400px",
  background: isHomePage ? "white" : theme.palette.primary.light,
  color: isHomePage ? theme.palette.primary.dark : "white",
  borderRadius: theme.spacing(0.6),
  border: `1px solid ${theme.palette.primary.main}`,
  padding: theme.spacing(0.4),
}));

function GlobalSearch({ isHomePage }) {
  const { setOpen } = useContext(SearchContext);
  const shortcutText = navigator?.platform.indexOf("Mac") > -1 ? "⌘ K" : "Ctrl+K";
  const searchButtonContainer = {
    width: 1,
    display: "flex",
    justifyContent: "center",
    ...(isHomePage && {
      margin: theme => `${theme.spacing(2)} 0 ${theme.spacing(3)}`,
    }),
  };

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
    <Box sx={searchButtonContainer}>
      <SearchButton
        isHomePage={isHomePage}
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            typography: "subtitle1",
            alignItems: "center",
            lineHeight: "normal",
          }}
        >
          <Box sx={{ paddingLeft: theme => theme.spacing(1) }}>
            <FontAwesomeIcon icon={faMagnifyingGlass} size="xs" />
          </Box>
          Search...
          <Box
            sx={{
              typography: "caption",
              fontWeight: "bold",
              color: "white",
              backgroundColor: theme => theme.palette.primary.main,
              padding: theme => `${theme.spacing(0.1)} ${theme.spacing(1)}`,
              borderRadius: theme => theme.spacing(0.4),
            }}
          >
            {shortcutText}
          </Box>
        </Box>
      </SearchButton>

      <GlobalSearchDialog />
    </Box>
  );
}

export default GlobalSearch;
