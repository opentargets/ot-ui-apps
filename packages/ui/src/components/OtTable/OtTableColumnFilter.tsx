import { ReactElement, useState } from "react";
import { Column } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  Badge,
  ClickAwayListener,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  TextField,
} from "@mui/material";
import { v1 } from "uuid";
import { ColumnFilterPopper } from "./otTableLayout";

function OtTableColumnFilter({ column }: { column: Column<any, unknown> }): ReactElement {
  /*****************************************
   *  COLUMN FILTER VALUE VARIABLE CHECKS  *
   * IF ANY FILTER IS APPLIED TO THE TABLE *
   *       AND SHOW FILTER AS ACTIVE       *
   *****************************************/
  const columnFilterValue = column.getFilterValue();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [columnFilterInputValue, setColumnFilterInputValue] = useState("");
  const sortedUniqueValues = getAllUniqueOptions();

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  /**************************************************
   * RETURNS UNIQUE VALUES FROM A COLUMN WITH COUNT *
   *            EXAMPLE: {"COMPLETED": 1 }          *
   **************************************************/
  function getAllUniqueOptions() {
    const uniqueArray = Array.from(column.getFacetedUniqueValues()).sort();
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
      {/* FILTER BUTTON ICON */}
      <IconButton size="small" aria-label="filter" onClick={handleClick}>
        <Badge color="primary" variant="dot" invisible={!columnFilterValue}>
          <FontAwesomeIcon icon={faFilter} size="xs" />
        </Badge>
      </IconButton>

      {/* FILTER POPOVER */}
      <ColumnFilterPopper id={id} open={open} anchorEl={anchorEl}>
        <ClickAwayListener onClickAway={handleClose}>
          <Grid container direction="column" spacing={2}>
            {/* INPUT FOR COLUMN FILTER */}
            <Grid sx={{ width: 1 }} item>
              <TextField
                sx={{ width: 1, padding: theme => `${theme.spacing(1)} ${theme.spacing(1.5)}` }}
                autoFocus
                variant="standard"
                value={columnFilterInputValue}
                onChange={e => setColumnFilterInputValue(e.target.value)}
                placeholder={`Search..`}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton disableRipple onClick={clearInput}>
                        <FontAwesomeIcon icon={faXmark} size="xs" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            {/* LIST OF UNIQUE VALUES IN COLUMN */}
            <Grid item>
              <List aria-label="filter-list">
                {Object.keys(sortedUniqueValues).map(
                  keyName =>
                    /****************************************************
                     *  STRING.SEARCH FUNCTION FILTERS THE LIST OF  *
                     * UNIQUE VALUES WITHOUT HAVING TO MODIFY ANY STATE *
                     ****************************************************/
                    String(keyName).search(new RegExp(columnFilterInputValue, "i")) !== -1 && (
                      <ListItemButton
                        disableRipple
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
        </ClickAwayListener>
      </ColumnFilterPopper>

      <div className="h-1" />
    </>
  );
}

export default OtTableColumnFilter;
