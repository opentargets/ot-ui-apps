import { useState } from 'react';
import { Button, Box } from '@material-ui/core';
import { Drawer } from './components';
import BlocksTreeView from './BlocksTreeView';

function EditDrawer({ blocks, setBlocks }) {
  const [open, setOpen] = useState(false);

  const closeDrawer = () => {
    setOpen(false);
  };

  const toggleDrawer = event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setOpen(true);
  };

  const handleUpdate = () => {
    const inputValue = document.querySelector('.state-input').value;
    const objValue = JSON.parse(inputValue);
    setBlocks(objValue);
  };

  return (
    <>
      <Button variant="outlined" disableElevation onClick={toggleDrawer}>
        Edit
      </Button>
      <Drawer anchor="right" open={open} onClose={closeDrawer}>
        <Box
          marginTop={10}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <BlocksTreeView blocksState={blocks} />
        </Box>
        <Box
          marginTop={10}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <textarea
            rows="40"
            cols={50}
            value={JSON.stringify(blocks, null, 4)}
            className="state-input"
          />
        </Box>
        <Box
          marginTop={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button variant="outlined" disableElevation onClick={handleUpdate}>
            Update state
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

export default EditDrawer;
