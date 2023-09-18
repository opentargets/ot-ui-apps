import { useState } from 'react';
import {
  Popover,
  FormGroup,
  Button,
  FormControlLabel,
  Checkbox,
  Switch,
} from '@mui/material';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from '@mui/material/styles';

import useAotfContext from './hooks/useAotfContext';

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
        startIcon={<FontAwesomeIcon icon={faGear} size="lg" />}
      >
        Advanced options
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
              control={
                <Switch
                  checked={activeHeadersControlls}
                  onChange={() =>
                    setActiveHeadersControlls(!activeHeadersControlls)
                  }
                />
              }
              label="Show data sources controls"
            />
          </FormGroup>
          {/* <FormGroup>
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
          </FormGroup> */}
        </PopoverContent>
      </Popover>
    </>
  );
}

export default DataMenu;
