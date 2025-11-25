import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { Box, FormControlLabel, FormGroup, Popover, Switch, Typography } from "@mui/material";
import { type MouseEvent, type ReactElement, useState } from "react";
import { FacetsSelect, PopoverButton } from "ui";
import useAotfContext from "../hooks/useAotfContext";
import { setIncludeMeasurements } from "../context/aotfActions";

function FacetsSearch(): ReactElement {
  const {
    entityToGet,
    facetFilterSelect,
    id,
    state: { facetFilters, includeMeasurements },
    dispatch,
  } = useAotfContext();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "simple-popover" : undefined;

  const handleIncludeMeasurements = (event: React.ChangeEvent<HTMLInputElement>) => {
   dispatch(setIncludeMeasurements(event.target.checked));
  };

  return (
    <Box>
      <PopoverButton
        popoverId={popoverId}
        open={open}
        icon={faFilter}
        label="Advanced filters"
        handleClick={handleClick}
        ariaLabel="Advanced filters"
        disableElevation
        iconSize="lg"
        sx={{ height: 1, maxHeight: "45px" }}
      />

      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        disableScrollLock
        elevation={1}
      >
        <Box sx={{ width: "450px", display: "flex", p: 3, flexDirection: "column", gap: 2 }}>
          <FormGroup>
            <FormControlLabel control={<Switch
            checked={includeMeasurements}
            onChange={handleIncludeMeasurements}
            inputProps={{ "aria-label": "Include measurements" }}
          />} label="Include measurements" />
          </FormGroup>
          
          <FacetsSelect
            id={id}
            entityToGet={entityToGet}
            onFacetSelect={facetFilterSelect}
            parentState={facetFilters}
          />
        </Box>
      </Popover>
    </Box>
  );
}
export default FacetsSearch;
