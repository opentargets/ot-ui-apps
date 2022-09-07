import {
  Popover,
  FormGroup,
  Button,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from '@material-ui/styles';

import { useState } from 'react';

const TextContent = styled('div')({
  marginLeft: '5px',
});

const PopoverContent = styled('div')({
  padding: '15px',
});

function DataMenu({
  enableIndirect,
  setEnableIndirect,
  activeWeightsControlls,
  setActiveWeightsControlls,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button
        aria-describedby={id}
        onClick={handleClick}
        variant="contained"
        disableElevation
      >
        <FontAwesomeIcon icon={faGear} size="lg" />
        <TextContent>Advance filter options</TextContent>
      </Button>
      <Popover
        id={id}
        anchorEl={anchorEl}
        onClose={handleClose}
        // onClose={() => setActive(false)}
        open={open}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <PopoverContent>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={enableIndirect}
                  onChange={() => setEnableIndirect(!enableIndirect)}
                />
              }
              label="Enable Indirect"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={activeWeightsControlls}
                  onChange={() =>
                    setActiveWeightsControlls(!activeWeightsControlls)
                  }
                />
              }
              label="Show weights controlls"
            />
          </FormGroup>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DataMenu;
