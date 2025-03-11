import { useState } from "react";
import { Popover, FormGroup, Button, FormControlLabel, Box, Switch } from "@mui/material";
import { faCaretUp, faCaretDown, faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "@mui/material/styles";
import { Tooltip } from "ui";

import useAotfContext from "../hooks/useAotfContext";

const StyledBotton = styled(Button)({
  border: "none",
  "& .MuiButton-startIcon": {
    fontSize: "14px !important",
  },
});

const PopoverContent = styled("div")({
  padding: "15px",
});

function DataMenu() {
  const [anchorEl, setAnchorEl] = useState(null);

  const { activeHeadersControlls, setActiveHeadersControlls, displayedTable } = useAotfContext();

  const isPrioritisation = displayedTable === "prioritisations";

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
    setActiveHeadersControlls(!activeHeadersControlls);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <StyledBotton
        aria-describedby={id}
        onClick={handleClick}
        variant="text"
        disableElevation
        disabled={isPrioritisation}
        sx={{ height: 1, maxHeight: "45px" }}
        aria-label="Advanced options"
      >
        <Box component="span" sx={{ mr: 1 }}>
          <FontAwesomeIcon icon={faGear} size="lg" />
        </Box>
        Column options
        <Box component="span" sx={{ ml: 1 }}>
          {activeHeadersControlls ? (
            <FontAwesomeIcon icon={faCaretUp} />
          ) : (
            <FontAwesomeIcon icon={faCaretDown} />
          )}
        </Box>
      </StyledBotton>
    </>
  );
}

export default DataMenu;
