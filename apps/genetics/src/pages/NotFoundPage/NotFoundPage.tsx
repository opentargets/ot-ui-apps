import { Typography } from '@material-ui/core';

import BasePage from '../BasePage';
import { EmptyPage } from 'ui';
import config from '../../config';

const NotFoundPage = () => {
  return (
    <BasePage>
      <EmptyPage
        communityLink={config.profile.communityUrl}
        documentationLink={config.profile.documentationUrl}
      >
        <Typography>This page could not be found.</Typography>
      </EmptyPage>
    </BasePage>
  );
};

export default NotFoundPage;
