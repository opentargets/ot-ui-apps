import { useState } from "react";
import { Column, Table } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  Badge,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  Popover,
  TextField,
} from "@mui/material";
import { v1 } from "uuid";

function OtTableColumnFilter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [columnFilterInputValue, setColumnFilterInputValue] = useState("");
  const sortedUniqueValues = getAllUniqueOptions();

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  function getAllUniqueOptions() {
    const uniqueArray = Array.from(column.getFacetedUniqueValues())
      .sort()
      .filter(n => n[0] && n);
    const uniqueObjectWithCount = Object.fromEntries(uniqueArray);
    return uniqueObjectWithCount;
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function clearInput() {
    column.setFilterValue("");
    setColumnFilterInputValue("");
  }

  return (
    <>
      <IconButton size="small" aria-label="filter" onClick={handleClick}>
        <Badge color="primary" variant="dot" invisible={!columnFilterValue}>
          <FontAwesomeIcon icon={faFilter} size="xs" />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{ maxHeight: "60vh" }}
      >
        <Grid
          container
          direction="column"
          // justifyContent="center"
          spacing={2}
        >
          <Grid sx={{ width: 1 }} item>
            <TextField
              sx={{ width: 1, padding: theme => `${theme.spacing(1)} ${theme.spacing(1.5)}` }}
              autoFocus
              variant="standard"
              value={columnFilterInputValue}
              onChange={e => setColumnFilterInputValue(e.target.value)}
              placeholder={`Search..`}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={clearInput}>
                      <FontAwesomeIcon icon={faXmark} size="xs" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item>
            <List aria-label="filter-list">
              {Object.keys(sortedUniqueValues).map(
                keyName =>
                  // TO filter List as per inputValue
                  String(keyName).search(new RegExp(columnFilterInputValue, "i")) !== -1 && (
                    <ListItemButton
                      key={v1()}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                      onClick={() => {
                        column.setFilterValue(keyName);
                        setColumnFilterInputValue(keyName);
                        handleClose();
                      }}
                    >
                      <span>{keyName}</span>
                      <span>
                        <strong>&#40;{sortedUniqueValues[keyName]}&#41;</strong>
                      </span>
                    </ListItemButton>
                  )
              )}
            </List>
          </Grid>
        </Grid>
      </Popover>

      <div className="h-1" />
    </>
  );
}

export default OtTableColumnFilter;
