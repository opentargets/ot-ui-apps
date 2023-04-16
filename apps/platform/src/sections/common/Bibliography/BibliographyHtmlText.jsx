import React from 'react';
import { Typography } from '@mui/material';

const BibliographyHtmlText = ({ text }) => {
  return (
    <Typography variant="body1" dangerouslySetInnerHTML={{ __html: text }} />
  );
};

export default BibliographyHtmlText;
