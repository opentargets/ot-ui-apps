import { useQuery } from "@apollo/client";
import { Box, Tab, Tabs } from "@mui/material";
import type { ReactElement } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { BasePage, ScrollToTop } from "ui";
import NotFoundPage from "../NotFoundPage";
import CREDIBLE_SET_PAGE_QUERY from "./CredibleSetPage.gql";
import Header from "./Header";
import Profile from "./Profile";

function CredibleSetPage(): ReactElement {
  const location = useLocation();
  const { studyLocusId } = useParams() as { studyLocusId: string };

  const { loading, data } = useQuery(CREDIBLE_SET_PAGE_QUERY, {
    variables: { studyLocusId },
  });

  if (data && !data?.credibleSet) {
    return <NotFoundPage />;
  }

  const { id: studyId, studyType } = data?.credibleSet?.study || {};
  const { id: variantId, referenceAllele, alternateAllele } = data?.credibleSet?.variant || {};

  return (
    <BasePage
      title={
        variantId && studyId ? `Credible set around ${variantId} for ${studyId}` : studyLocusId
      }
      description={`Annotation information for credible set ${studyLocusId}`}
      location={location}
    >
      <>
        <Header
          loading={loading}
          studyId={studyId}
          variantId={variantId}
          referenceAllele={referenceAllele}
          alternateAllele={alternateAllele}
          studyType={studyType}
        />
        <ScrollToTop />
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={location.pathname}>
            <Tab
              label={<Box sx={{ textTransform: "capitalize" }}>Profile</Box>}
              value={location.pathname}
              component={Link}
              to={`/credible-set/${studyLocusId}`}
            />
          </Tabs>
        </Box>
        <Profile
          studyLocusId={studyLocusId}
          variantId={variantId}
          referenceAllele={referenceAllele}
          alternateAllele={alternateAllele}
          studyType={studyType}
          loading={loading}
        />
      </>
    </BasePage>
  );
}

export default CredibleSetPage;
