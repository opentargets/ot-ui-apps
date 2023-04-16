import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';

const listComponetStyles = makeStyles(() => ({
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const Loader = ({ message = '', pageSize = 5 }) => (
  <Box
    height={pageSize === 5 ? '850px' : pageSize === 10 ? '1640px' : '4040px'}
    display="flex"
    justifyContent="center"
    alignItems="center"
    flexDirection="column"
  >
    <CircularProgress size={60} />
    <Box mt={6}>
      <Typography className={listComponetStyles.AccordionSubtitle}>
        {message}
      </Typography>
    </Box>
  </Box>
);

export default Loader;
