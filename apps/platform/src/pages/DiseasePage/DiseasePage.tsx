import { ReactElement, Suspense } from "react";
import { useQuery } from "@apollo/client";
import { Box, Tab, Tabs } from "@mui/material";
import { Link, Redirect, Route, Switch, useLocation, useParams } from "react-router-dom";
import { LoadingBackdrop, BasePage, ScrollToTop } from "ui";

import Header from "./Header";
import NotFoundPage from "../NotFoundPage";

import DISEASE_PAGE_QUERY from "./DiseasePage.gql";
import Associations from "./DiseaseAssociations";
import Profile from "./Profile";

type DiseaseURLParams = {
  efoId: string;
};

function DiseasePage(): ReactElement {
  const location = useLocation();
  const { efoId } = useParams<DiseaseURLParams>();
  const { loading, data } = useQuery(DISEASE_PAGE_QUERY, {
    variables: { efoId },
  });

  if (data && !data.disease) {
    return <NotFoundPage />;
  }

  const { name, dbXRefs } = data?.disease || {};

  return (
    <BasePage
      title={
        location.pathname.includes("associations")
          ? `Targets associated with ${name}`
          : `${name} profile page`
      }
      description={
        location.pathname.includes("associations")
          ? `Ranked list of targets associated with ${name}`
          : `Annotation information for ${name}`
      }
      location={location}
    >
      <Header loading={loading} efoId={efoId} name={name} dbXRefs={dbXRefs} />
      <ScrollToTop />
      <Route
        path="/"
        render={history => (
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={history.location.pathname !== "/" ? history.location.pathname : false}>
              <Tab
                label={
                  <Box sx={{ textTransform: "capitalize" }}>
                    <div>Associated targets</div>
                  </Box>
                }
                value={`/disease/${efoId}/associations`}
                component={Link}
                to={`/disease/${efoId}/associations`}
              />
              <Tab
                label={<Box sx={{ textTransform: "capitalize" }}>Profile</Box>}
                value={`/disease/${efoId}`}
                component={Link}
                to={`/disease/${efoId}`}
              />
            </Tabs>
          </Box>
        )}
      />
      <Suspense fallback={<LoadingBackdrop height={1500} />}>
        <Switch>
          <Route exact path="/disease/:efoId">
            <Profile efoId={efoId} name={name} />
          </Route>
          <Route path="/disease/:efoId/associations">
            <Associations efoId={efoId} />
          </Route>
          <Route path="*">
            <Redirect to={`/disease/${efoId}`} />
          </Route>
        </Switch>
      </Suspense>
    </BasePage>
  );
}

export default DiseasePage;
