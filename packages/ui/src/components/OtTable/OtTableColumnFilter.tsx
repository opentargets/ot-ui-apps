import React, { useState } from "react";
import { Column, Table } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  Badge,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItemButton,
  Popover,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { v1 } from "uuid";

// const useStyles = makeStyles(theme => ({
//   filterInput: {
//     maxWidth: "100%",
//     // padding: "0.3rem 0.5rem",
//     // width: "min-content",
//     // minWidth: "7rem",
//   },
// }));

function OtTableColumnFilter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const columnFilterValue = column.getFilterValue();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
  console.log("firstValue", firstValue);

  const sortedUniqueValues = Array.from(column.getFacetedUniqueValues().keys()).sort();
  // typeof firstValue === "number" ? [] : Array.from(column.getFacetedUniqueValues().keys()).sort();

  function clearInput() {
    column.setFilterValue("");
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
            <Input
              sx={{ width: 1, padding: theme => `${theme.spacing(1)} ${theme.spacing(1.5)}` }}
              autoFocus={true}
              value={(columnFilterValue ?? "") as string}
              onChange={e => column.setFilterValue(e.target.value)}
              placeholder={`Search..`}
              startAdornment={
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={clearInput}>
                    <FontAwesomeIcon icon={faXmark} />
                  </IconButton>
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item>
            <List aria-label="filter-list">
              {sortedUniqueValues.slice(0, 5000).map((value: any) => (
                <ListItemButton
                  key={v1()}
                  onClick={() => {
                    handleClose();
                    column.setFilterValue(value);
                  }}
                >
                  {value}
                </ListItemButton>
              ))}
            </List>
          </Grid>
        </Grid>

        {/* <input
          type="text"
          value={(columnFilterValue ?? "") as string}
          onChange={(e) => column.setFilterValue(e.target.value)}
          placeholder={`Search..`}
          list={column.id + "list"}
        /> */}
      </Popover>

      <div className="h-1" />
    </>
  );
}

export default OtTableColumnFilter;
