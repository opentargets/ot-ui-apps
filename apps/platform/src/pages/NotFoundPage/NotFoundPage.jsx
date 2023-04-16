import React from 'react';
import Typography from '@mui/material/Typography';

import BasePage from '../../components/BasePage';
import EmptyPage from '../EmptyPage';

const NotFoundPage = () => {
  return (
    <BasePage>
      <EmptyPage>
        <Typography>404 Page Not Found</Typography>
      </EmptyPage>
    </BasePage>
  );
};

export default NotFoundPage;
