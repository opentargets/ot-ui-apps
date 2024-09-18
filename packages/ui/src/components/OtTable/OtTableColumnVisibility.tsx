import { MouseEvent, ReactElement, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  FormControlLabel,
  FormGroup,
  List,
  ListItemButton,
} from "@mui/material";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { OtTableColumnVisibilityProps } from "./table.types";
import OtPopper from "../OtPopper";

function OtTableColumnVisibility({ table }: OtTableColumnVisibilityProps): ReactElement {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();
  const open = Boolean(anchorEl);
  const id = open ? "column-visibility-button" : undefined;

  function handleClick(event: MouseEvent<HTMLElement>): void {
    setAnchorEl(event.currentTarget);
  }

  function handleClose(): void {
    setAnchorEl(null);
  }

  function isLastColumnActive(column): boolean {
    return table.getVisibleLeafColumns().length === 1 && column.getIsVisible();
  }

  function isColumnVisibilityStateChanged(): boolean {
    return table.getVisibleLeafColumns().length !== table.getAllColumns().length;
  }

  return (
    <>
      <Badge color="primary" variant="dot" invisible={!isColumnVisibilityStateChanged()}>
        <Button aria-describedby={id} onClick={handleClick} sx={{ display: "flex", gap: 1 }}>
          <FontAwesomeIcon icon={faGear} /> Columns
        </Button>
      </Badge>

      <OtPopper id={id} open={open} anchorEl={anchorEl}>
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
      </OtPopper>
    </>
  );
}
export default OtTableColumnVisibility;
