import { useState } from "react";
import { Popover, FormGroup, Button, FormControlLabel, Checkbox, Switch } from "@mui/material";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "@mui/material/styles";
import { Tooltip } from "ui";

import useAotfContext from "../hooks/useAotfContext";

const PopoverContent = styled("div")({
  padding: "15px",
});

function DataMenu() {
  const [anchorEl, setAnchorEl] = useState(null);

  const {
    activeHeadersControlls,
    setActiveHeadersControlls,
    displayedTable,
  } = useAotfContext();

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
      <Tooltip placement="bottom" title="Advanced options">
        <Button
          aria-describedby={id}
          onClick={handleClick}
          variant="outlined"
          disableElevation
          disabled={isPrioritisation}
          sx={{ height: 1, maxHeight: "45px" }}
        >
          <FontAwesomeIcon icon={faGear} size="lg" />
        </Button>
      </Tooltip>
      <Popover
        id={id}
        anchorEl={anchorEl}
        onClose={handleClose}
        open={open}
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
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={activeHeadersControlls}
                  onChange={() => setActiveHeadersControlls(!activeHeadersControlls)}
                />
              }
              label="Show data sources controls"
            />
          </FormGroup>
        </PopoverContent>
      </Popover>
    </>
  );
}

export default DataMenu;
