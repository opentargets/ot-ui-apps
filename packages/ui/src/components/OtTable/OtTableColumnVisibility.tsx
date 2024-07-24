import { ReactElement, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  FormControlLabel,
  FormGroup,
  List,
  ListItemButton,
} from "@mui/material";
import { faTableColumns } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { OtTableColumnVisibilityProps } from "./table.types";
import { ColumnFilterPopper } from "./otTableLayout";

function OtTableColumnVisibility({ table }: OtTableColumnVisibilityProps): ReactElement {
  const [anchorEl, setAnchorEl] = useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function isLastColumnActive(column) {
    return table.getVisibleLeafColumns().length === 1 && column.getIsVisible();
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <>
      <Button aria-describedby={id} onClick={handleClick} sx={{ display: "flex", gap: 1 }}>
        <FontAwesomeIcon icon={faTableColumns} /> Columns
      </Button>

      <ColumnFilterPopper id={id} open={open} anchorEl={anchorEl}>
        <ClickAwayListener onClickAway={handleClose}>
          <Box>
            <FormGroup>
              <List sx={{ p: 0 }} aria-label="column-visibility-list">
                {table.getAllLeafColumns().map(column => (
                  <ListItemButton key={column.id} sx={{ px: 1.5, py: 0.2, typography: "caption" }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          onChange={column.getToggleVisibilityHandler()}
                          checked={column.getIsVisible()}
                        />
                      }
                      disabled={isLastColumnActive(column)}
                      label={column.columnDef.header || column.id}
                    />
                  </ListItemButton>
                ))}
              </List>
            </FormGroup>
          </Box>
        </ClickAwayListener>
      </ColumnFilterPopper>
    </>
  );
}
export default OtTableColumnVisibility;
