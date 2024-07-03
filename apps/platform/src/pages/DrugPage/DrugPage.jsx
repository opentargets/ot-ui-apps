import { lazy, Suspense } from "react";
import { useQuery } from "@apollo/client";
import { BasePage, ScrollToTop, LoadingBackdrop } from "ui";
import { Box, Tabs, Tab } from "@mui/material";
import {
  useLocation,
  useParams,
  Switch,
  Route,
  useRouteMatch,
  Link,
  Redirect,
} from "react-router-dom";

import Header from "./Header";
import NotFoundPage from "../NotFoundPage";
import DRUG_PAGE_QUERY from "./DrugPage.gql";

const Profile = lazy(() => import("./Profile"));

function DrugPage() {
  const location = useLocation();
  const { chemblId } = useParams();
  const { path } = useRouteMatch();

  const { loading, data } = useQuery(DRUG_PAGE_QUERY, {
    variables: { chemblId },
  });

  if (data && !data.drug) {
    return <NotFoundPage />;
  }

  const { name, crossReferences } = data?.drug || {};

  return (
    <BasePage
      title={`${name || chemblId} profile page`}
      description={`Annotation information for ${name || chemblId}`}
      location={location}
    >
      <Header loading={loading} chemblId={chemblId} name={name} crossReferences={crossReferences} />
      <ScrollToTop />

      <Route
        path="/"
        render={history => (
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={history.location.pathname !== "/" ? history.location.pathname : false}>
              <Tab
                label={<Box sx={{ textTransform: "capitalize" }}>Profile</Box>}
                value={`/drug/${chemblId}`}
                component={Link}
                to={`/drug/${chemblId}`}
              />
            </Tabs>
          </Box>
        )}
      />
      <Suspense fallback={<LoadingBackdrop height={11500} />}>
        <Switch>
          <Route exact path={path}>
            <Profile chemblId={chemblId} name={name} />
          </Route>
          <Route path="*">
            <Redirect to={`/drug/${chemblId}`} />
          </Route>
        </Switch>
      </Suspense>
    </BasePage>
  );
}

export default DrugPage;
