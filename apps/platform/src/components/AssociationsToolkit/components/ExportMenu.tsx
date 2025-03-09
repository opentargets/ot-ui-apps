import { useState } from "react";
import { Popover, FormGroup, Button, FormControlLabel, Box, Switch } from "@mui/material";
import { faCaretUp, faCaretDown, faGear, faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "@mui/material/styles";
import { Tooltip } from "ui";

import useAotfContext from "../hooks/useAotfContext";
import DataDownloader from "./DataDownloader";
import AotfApiPlayground from "./AotfApiPlayground";

const StyledBotton = styled(Button)({
  border: "none",
  "& .MuiButton-startIcon": {
    fontSize: "14px !important",
  },
});

const PopoverContent = styled("div")({
  padding: "15px",
});

function ExportMenu() {
  const [anchorEl, setAnchorEl] = useState(null);

  const { activeHeadersControlls, setActiveHeadersControlls, displayedTable } = useAotfContext();

  const isPrioritisation = displayedTable === "prioritisations";

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        sx={{ height: 1, maxHeight: "45px" }}
        aria-label="Advanced options"
      >
        <Box component="span" sx={{ mr: 1 }}>
          <FontAwesomeIcon icon={faFileArrowDown} size="lg" />
        </Box>
        Export
        <Box component="span" sx={{ ml: 1 }}>
          {open ? <FontAwesomeIcon icon={faCaretUp} /> : <FontAwesomeIcon icon={faCaretDown} />}
        </Box>
      </StyledBotton>

      <Popover
        disableScrollLock
        id={id}
        anchorEl={anchorEl}
        onClose={handleClose}
        open={open}
        elevation={1}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <PopoverContent>
          <DataDownloader />
          {/* <Box onClick={() => handleClose()}> */}
          <AotfApiPlayground />
          {/* </Box> */}
        </PopoverContent>
      </Popover>
    </>
  );
}

export default ExportMenu;
