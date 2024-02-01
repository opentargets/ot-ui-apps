import React, { useState } from "react";
import { List, FormControlLabel, Checkbox, Box } from "@mui/material";

const LabelElement = ({ children }) => (
  <Box sx={{ typography: "body2", fontWeight: "bold" }} display="inline">
    {children}
  </Box>
);

const NestedItem = ({ children, hits = [] }) => {
  const [childrenCheckbox, setChildrenCheckbox] = useState(hits);

  function handleParentChange() {
    const checkboxUpdateState = [...childrenCheckbox];
    checkboxUpdateState.every(el => !el.checked)
      ? checkboxUpdateState.map(el => (el.checked = true))
      : checkboxUpdateState.map(el => (el.checked = false));
    setChildrenCheckbox(checkboxUpdateState);
  }

  function handleChangeChildCheckbox(hitId) {
    const checkboxUpdateState = [...childrenCheckbox];
    checkboxUpdateState.find(el => {
      if (el.id === hitId) return (el.checked = !el.checked);
    });
    setChildrenCheckbox(checkboxUpdateState);
  }

  return (
    <List sx={{ mx: 1.5 }}>
      {childrenCheckbox.length === 1 && (
        <>
          {childrenCheckbox.map(hit => (
            <Box key={hit.id}>
              <FormControlLabel
                label={
                  <>
                    {" "}
                    {LabelElement} - {hit.name || hit.id}{" "}
                  </>
                }
                control={
                  <Checkbox
                    checked={hit.checked}
                    onChange={() => handleChangeChildCheckbox(hit.id)}
                  />
                }
              />
            </Box>
          ))}
        </>
      )}

      {childrenCheckbox.length > 1 && (
        <>
          <FormControlLabel
            label={LabelElement}
            control={
              <Checkbox
                indeterminate={
                  childrenCheckbox.some(el => el.checked) &&
                  !childrenCheckbox.every(el => el.checked)
                }
                checked={childrenCheckbox.every(el => el.checked)}
                onChange={handleParentChange}
              />
            }
          />
          {childrenCheckbox.map(hit => (
            <Box sx={{ ml: theme => theme.spacing(4) }} key={hit.id}>
              <FormControlLabel
                label={hit.name || hit.id}
                control={
                  <Checkbox
                    checked={hit.checked}
                    onChange={() => handleChangeChildCheckbox(hit.id)}
                  />
                }
              />
            </Box>
          ))}
        </>
      )}
      {childrenCheckbox.length <= 0 && (
        <FormControlLabel label={LabelElement} control={<Checkbox checked={false} disabled />} />
      )}
    </List>
  );
};

export default NestedItem;
