import React from 'react';

import { Typography } from '@mui/material';

function SectionError(error) {
  return (
    <Typography color="error" align="center">
      {error.message}
    </Typography>
  );
}

export default SectionError;
