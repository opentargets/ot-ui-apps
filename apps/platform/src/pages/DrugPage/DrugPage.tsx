import { useQuery } from "@apollo/client";
import { Box, Tab, Tabs } from "@mui/material";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import { BasePage, ScrollToTop } from "ui";

import NotFoundPage from "../NotFoundPage";
import DRUG_PAGE_QUERY from "./DrugPage.gql";
import Header from "./Header";

import type { ReactNode } from "react";
import Profile from "./Profile";

function DrugPage(): ReactNode {
  const location = useLocation();
  const { chemblId } = useParams();

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
      <>
        <Header
          loading={loading}
          chemblId={chemblId}
          name={name}
          crossReferences={crossReferences}
        />
        <ScrollToTop />
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={location.pathname}>
            <Tab
              label={<Box sx={{ textTransform: "capitalize" }}>Profile</Box>}
              value={`/drug/${chemblId}`}
              component={Link}
              to={`/drug/${chemblId}`}
            />
          </Tabs>
        </Box>
        <Routes>
          <Route path="/" element={<Profile chemblId={chemblId} name={name} />} />
        </Routes>
      </>
    </BasePage>
  );
}

export default DrugPage;
