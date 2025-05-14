import { Typography } from "@mui/material";

import { getConfig } from "@ot/config";
import { BasePage, EmptyPage } from "ui";

const config = getConfig();

function NotFoundPage() {
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
}

export default NotFoundPage;
