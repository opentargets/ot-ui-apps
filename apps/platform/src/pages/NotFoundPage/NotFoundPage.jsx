import { Typography } from '@material-ui/core';

import { EmptyPage } from 'ui';
import BasePage from '../../components/BasePage';
import config from '../../config';

function NotFoundPage() {
  return (
    <BasePage>
      <EmptyPage communityLink={config.profile.communityUrl} documentationLink={config.profile.documentationUrl}>
        <Typography>This page could not be found.</Typography>
      </EmptyPage>
    </BasePage>
  );
}

export default NotFoundPage;
