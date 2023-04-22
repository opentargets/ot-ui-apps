import { useState } from 'react';
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

import useAotfContext from './hooks/useAotfContext';

const TextContent = styled('div')({
  marginLeft: '5px',
});

const PopoverContent = styled('div')({
  padding: '15px',
});

function DataMenu() {
  const [anchorEl, setAnchorEl] = useState(null);

  const {
    enableIndirect,
    setEnableIndirect,
    activeHeadersControlls,
    setActiveHeadersControlls,
    displayedTable,
  } = useAotfContext();

  const isPrioritisation = displayedTable === 'prioritisations';

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Button
        aria-describedby={id}
        onClick={handleClick}
        variant="outlined"
        disableElevation
        disabled={isPrioritisation}
      >
        <FontAwesomeIcon icon={faGear} size="lg" />
        <TextContent>Advanced options</TextContent>
      </Button>
      <Popover
        id={id}
        anchorEl={anchorEl}
        onClose={handleClose}
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
              disabled={isPrioritisation}
              control={
                <Checkbox
                  color="primary"
                  checked={activeHeadersControlls}
                  onChange={() =>
                    setActiveHeadersControlls(!activeHeadersControlls)
                  }
                />
              }
              label="Show data sources controls"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              disabled={isPrioritisation}
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
        </PopoverContent>
      </Popover>
    </>
  );
}

export default DataMenu;
