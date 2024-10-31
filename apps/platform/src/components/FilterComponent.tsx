import * as React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Box,
  Fade,
  Alert,
  Modal,
  Switch,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { Tooltip } from "ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { ReactElement, useEffect, useState } from "react";
import { isEqual } from "lodash";
import { DataSource } from "./AssociationsToolkit/types";
import { Definition } from "./ProfileToolkit/types";

interface ChipBaseProps {
  label: string;
  onClick: () => void;
}

export function ChipBase({ label, onClick }: ChipBaseProps) {
  return (
    <Chip
      variant="outlined"
      label={
        <div
          style={{
            width: "72px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textAlign: "center",
          }}
        >
          {label}
        </div>
      }
      onClick={onClick}
      sx={{ margin: "3px" }}
    />
  );
}

interface AlertModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function AlertModal({ open, setOpen }: AlertModalProps) {
  const [timeoutVal, setTimeoutVal] = useState<number | undefined>(undefined);

  const alertStyles = {
    position: "absolute",
    top: "22.5%",
    left: "50%",
    transform: "translate(-51%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "8px",
  };

  useEffect(() => {
    clearTimeout(timeoutVal);
    if (open) {
      const val = setTimeout(() => {
        setOpen(false);
      }, 3800);
      setTimeoutVal(val);
    }
  }, [open]);

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        closeAfterTransition
        sx={{ ".MuiBackdrop-root": { backgroundColor: "transparent" } }}
      >
        <Fade in={open} timeout={{ enter: 0, exit: 500 }}>
          <Alert severity="warning" sx={alertStyles}>
            First item in the list is automatically selected.
          </Alert>
        </Fade>
      </Modal>
    </React.Fragment>
  );
}

interface FilterComponentProps {
  filterItems: (Definition | DataSource)[];
  selectedItems: (Definition | DataSource)[];
  setSelectedItems: React.Dispatch<React.SetStateAction<(Definition | DataSource)[]>>;
  defaultItems: (Definition | DataSource)[];
  alertVisibility?: boolean;
  setAlertVisibility?: (value: boolean) => void;
  title: string;
  label: string;
  isAssociations?: boolean;
  isPrioritisation?: boolean;
  filterAffectOverallScore?: boolean;
  setFilterAffectOverallScore?: (value: boolean) => void;
}

const emptyFunction: (value: boolean) => void = () => {
  // empty
};

export default function FilterComponent({
  filterItems,
  selectedItems,
  setSelectedItems,
  defaultItems,
  alertVisibility,
  setAlertVisibility = emptyFunction,
  title,
  label = "label",
  isAssociations = false,
  isPrioritisation = false,
  filterAffectOverallScore,
  setFilterAffectOverallScore = emptyFunction,
}: FilterComponentProps): ReactElement {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleToggle = (value: string) => () => {
    const newSelection = [...selectedItems].map(item => item[label as keyof typeof item]);
    const currentIndex = newSelection.indexOf(value);

    if (currentIndex === -1) {
      newSelection.push(value);
    } else {
      newSelection.splice(currentIndex, 1);
    }

    const newSelectedItems = filterItems.filter((item: Definition | DataSource) =>
      newSelection.includes(item[label as keyof typeof item])
    );
    if (newSelection.length === 0) {
      if (alertVisibility !== undefined) {
        setAlertVisibility(true);
      }
      setSelectedItems(filterItems.slice(0, 1));
    } else {
      setSelectedItems(newSelectedItems);
    }
  };

  const hideDefault = isEqual(filterItems, defaultItems);

  return (
    <>
      <Box sx={isAssociations ? {} : { marginTop: "2rem !important" }}>
        <Tooltip placement="bottom" title={title}>
          <Button
            aria-describedby={id}
            onClick={handleClick}
            variant="outlined"
            disableElevation
            disabled={isPrioritisation}
            sx={{ bgcolor: "white", height: 1, maxHeight: "45px" }}
          >
            <FontAwesomeIcon icon={faFilter} size={"lg"} />
          </Button>
        </Tooltip>
      </Box>
      <Dialog
        id={id}
        open={open}
        onClose={handleClose}
        sx={{
          ".MuiDialog-paper": {
            width: "70%",
            maxWidth: "800px !important",
            borderRadius: theme => theme.spacing(1),
            padding: 0,
            marginLeft: theme => theme.spacing(1.5),
            ".MuiList-padding": { padding: 0 },
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <div>
              {title} ({selectedItems.length} selected)
            </div>
            <div>
              <ChipBase label={"Select all"} onClick={() => setSelectedItems(filterItems)} />
              {hideDefault || (
                <ChipBase label={"Default"} onClick={() => setSelectedItems(defaultItems)} />
              )}
              <ChipBase
                label="Deselect all"
                onClick={() => {
                  if (alertVisibility !== undefined) {
                    setAlertVisibility(true);
                    setSelectedItems(filterItems.slice(0, 1));
                  } else {
                    setSelectedItems([]);
                  }
                }}
              />
            </div>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {alertVisibility && <AlertModal open={alertVisibility} setOpen={setAlertVisibility} />}
          {isAssociations && (
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filterAffectOverallScore}
                      onChange={() => {
                        setFilterAffectOverallScore(!filterAffectOverallScore);
                      }}
                    />
                  }
                  label={
                    <Tooltip
                      showHelpIcon
                      title={
                        "The data sources that are filtered out, are not excluded from the association score by default. Toggle this if you do want the filtered out data sources to be excluded from the overall association score."
                      }
                    >
                      Exclude from overall association score
                    </Tooltip>
                  }
                />
              </FormGroup>
            </Box>
          )}
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              "& ul": { padding: 0 },
              margin: "8px 0 8px 0",
            }}
            subheader={<li />}
          >
            <li key={"header"}>
              <ul>
                <div style={{ columns: filterItems.length < 5 ? 2 : 3, columnGap: "11px" }}>
                  {filterItems.map(item => {
                    const itemId = item[label as keyof typeof item];
                    const labelId = `checkbox-list-label-${itemId}`;

                    return typeof itemId === "string" ? (
                      <ListItem key={itemId} disablePadding>
                        <ListItemButton
                          role={undefined}
                          onClick={handleToggle(itemId)}
                          dense
                          selected={
                            selectedItems
                              .map(item => item[label as keyof typeof item])
                              .indexOf(itemId) > -1
                          }
                        >
                          <ListItemText id={labelId} primary={itemId} />
                        </ListItemButton>
                      </ListItem>
                    ) : (
                      <div>not found</div>
                    );
                  })}
                </div>
              </ul>
            </li>
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}
