import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Badge,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  Popover,
  makeStyles,
} from "@material-ui/core";
import { useMemo, useState } from "react";
import { faFilter, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

type OtTableColumnFilter = {
  column: Column<any, unknown>;
  table: Table<any>;
};

const useStyles = makeStyles(() => ({
  filterInput: {
    padding: "0.3rem 0.5rem",
    width: "min-content",
    minWidth: "7rem",
  },
}));

function OtTableColumnFilter({ column, table }: OtTableColumnFilter) {
  const classes = useStyles();

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

  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  return (
    <>
      <IconButton
        className={classes["d-none"]}
        size="small"
        aria-label="filter"
        onClick={handleClick}
      >
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
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Input
              className={classes.filterInput}
              value={(columnFilterValue ?? "") as string}
              onChange={(e) => column.setFilterValue(e.target.value)}
              placeholder={`Search..`}
              startAdornment={
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item>
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
      </Popover>

      <div className="h-1" />
    </>
  );
}

export default OtTableColumnFilter;
