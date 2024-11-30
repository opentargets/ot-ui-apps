import { ReactElement } from "react";
import { useQuery } from "@apollo/client";
import { Box, Tab, Tabs } from "@mui/material";
import { Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { BasePage, ScrollToTop } from "ui";

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
      {/* <Route
        path="/"
        render={history => (
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={history.location.pathname !== "/" ? history.location.pathname : false}>
              <Tab
                label={<Box sx={{ textTransform: "capitalize" }}>Associated targets</Box>}
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
      /> */}
      <Routes>
        <Route path="/disease/:efoId" element={<Profile efoId={efoId} name={name} />} />
        <Route path="/disease/:efoId/associations" element={<Associations efoId={efoId} />} />
        {/* <Route path="*">
          <Navigate to={`/disease/${efoId}`} />
        </Route> */}
      </Routes>
    </BasePage>
  );
}

export default DiseasePage;
