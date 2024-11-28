import { useQuery } from "@apollo/client";
import { useLocation, useParams, Switch, Route, useRouteMatch, Link } from "react-router-dom";
import { Box, Tabs, Tab } from "@mui/material";
import { BasePage, ScrollToTop } from "ui";
import Header from "./Header";
import NotFoundPage from "../NotFoundPage";
import CREDIBLE_SET_PAGE_QUERY from "./CredibleSetPage.gql";
import Profile from "./Profile";

function CredibleSetPage() {
  const location = useLocation();
  const { studyLocusId } = useParams() as { studyLocusId: string };
  const { path } = useRouteMatch();

  const { loading, data } = useQuery(CREDIBLE_SET_PAGE_QUERY, {
    variables: { studyLocusId: studyLocusId },
  });

  if (data && !data?.credibleSet) {
    return <NotFoundPage />;
  }

  const credibleSet = data?.credibleSet;
  const variantId = credibleSet?.variant?.id;
  const referenceAllele = credibleSet?.variant?.referenceAllele;
  const alternateAllele = credibleSet?.variant?.alternateAllele;
  const studyId = credibleSet?.study?.id;
  const studyType = credibleSet?.study?.studyType;

  if (!studyType) return null;

  return (
    <BasePage
      title={
        variantId && studyId ? `Credible set around ${variantId} for ${studyId}` : studyLocusId
      }
      description={`Annotation information for credible set ${studyLocusId}`}
      location={location}
    >
      <Header
        loading={loading}
        studyId={studyId}
        variantId={variantId}
        referenceAllele={referenceAllele}
        alternateAllele={alternateAllele}
        studyType={studyType}
      />
      <ScrollToTop />
      <Route
        path="/"
        render={history => (
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={history.location.pathname !== "/" ? history.location.pathname : false}>
              <Tab
                label={<Box sx={{ textTransform: "capitalize" }}>Profile</Box>}
                value={`/credible-set/${studyLocusId}`}
                component={Link}
                to={`/credible-set/${studyLocusId}`}
              />
            </Tabs>
          </Box>
        )}
      />

      <Switch>
        <Route exact path={path}>
          <Profile
            studyLocusId={studyLocusId}
            variantId={variantId}
            referenceAllele={referenceAllele}
            alternateAllele={alternateAllele}
            studyType={studyType}
          />
        </Route>
      </Switch>
    </BasePage>
  );
}

export default CredibleSetPage;
