import { Typography } from '@material-ui/core';

import { EmptyPage } from 'ui';
import BasePage from '../../components/BasePage';
// import EmptyPage from '../EmptyPage';

function NotFoundPage() {
  return (
    <BasePage>
      <EmptyPage>
        <Typography>This page could not be found</Typography>
      </EmptyPage>

    </BasePage>
  );
}

export default NotFoundPage;
