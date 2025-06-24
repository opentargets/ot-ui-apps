import { Box, Button, Divider, Popover, styled } from "@mui/material";
import { ReactElement, useState, MouseEvent } from "react";
import { FacetsSelect } from "ui";

import useAotfContext from "../hooks/useAotfContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp, faFilter } from "@fortawesome/free-solid-svg-icons";

import { DataUploader } from "..";

const FilterButton = styled(Button)({
  border: "none",
  "& .MuiButton-startIcon": {
    fontSize: "14px !important",
  },
});

function FacetsSearch(): ReactElement {
  const {
    entityToGet,
    facetFilterSelect,
    id,
    state: { facetFilters },
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

  return (
    <Box>
      <FilterButton
        aria-describedby={popoverId}
        variant="text"
        onClick={handleClick}
        sx={{ height: 1 }}
      >
        <Box component="span" sx={{ mr: 1 }}>
          <FontAwesomeIcon icon={faFilter} />
        </Box>
        Advanced filters
        <Box component="span" sx={{ ml: 1 }}>
          {open ? <FontAwesomeIcon icon={faCaretUp} /> : <FontAwesomeIcon icon={faCaretDown} />}
        </Box>
      </FilterButton>
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
          <DataUploader parentAction={handleClose} />

          <Divider flexItem sx={{ my: 1 }} />
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
