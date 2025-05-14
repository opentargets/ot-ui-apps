import { faCaretDown, faCaretUp, faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, MenuList, Popover } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";

import AotfApiPlayground from "./AotfApiPlayground";
import DataDownloader from "./DataDownloader";

const StyledBotton = styled(Button)({
  border: "none",
  "& .MuiButton-startIcon": {
    fontSize: "14px !important",
  },
});

function ExportMenu() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
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
        <MenuList dense>
          <DataDownloader />
          <AotfApiPlayground />
        </MenuList>
      </Popover>
    </>
  );
}

export default ExportMenu;
