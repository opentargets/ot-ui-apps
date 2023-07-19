import { Typography } from '@mui/material';

import { EmptyPage } from 'ui';
import BasePage from '../../components/BasePage';

function NotFoundPage() {
  return (
    <BasePage>
      <EmptyPage>
        <Typography>This page could not be found.</Typography>
      </EmptyPage>

    </BasePage>
  );
}

export default NotFoundPage;
