import { Typography } from '@material-ui/core';

function SectionError({ message }) {
  return (
    <Typography color="error" align="center">
      {message}
    </Typography>
  );
}

export default SectionError;
