import React from "react";
import { Column, Table } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  Badge,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Popover,
  TextField,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  filterInput: {
    padding: "0.3rem 0.5rem",
    width: "min-content",
    minWidth: "7rem",
  },
}));

function OtTableFilter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const columnFilterValue = column.getFilterValue();

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );
  return (
    <>
      <IconButton className={classes["d-none"]} size="small" aria-label="filter" onClick={handleClick}>
        <Badge
          color="primary"
          variant="dot"
          invisible={!Boolean(columnFilterValue)}
        >
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
      >
        <Grid
          container
          direction="column"
          // justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <Input
              className={classes.filterInput}
              value={(columnFilterValue ?? "") as string}
              onChange={(e) => column.setFilterValue(e.target.value)}
              placeholder={`Search..`}
              // size="small"
              startAdornment={
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </InputAdornment>
              }
            />

            {/* <TextField
              className={classes.filterInput}
              autoFocus
              type="text"
              value={(columnFilterValue ?? "") as string}
              onChange={(e) => column.setFilterValue(e.target.value)}
              placeholder={`Search..`}
              variant="outlined"
            /> */}
          </Grid>
          <Grid item>
            {/* <datalist id={column.id + "list"}>
              {sortedUniqueValues.slice(0, 5000).map((value: any) => (
                <option value={value} key={value} />
              ))}
            </datalist> */}
            <List aria-label="filter-list">
              {sortedUniqueValues.slice(0, 5000).map((value: any) => (
                <ListItem
                  key={value}
                  button
                  onClick={() => {
                    handleClose();
                    column.setFilterValue(value);
                  }}
                >
                  {value}
                </ListItem>
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

export default OtTableFilter;
