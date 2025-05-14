import { useQuery } from "@apollo/client";
import { Box, Tab, Tabs } from "@mui/material";
import type { ReactElement } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { BasePage, ScrollToTop } from "ui";
import NotFoundPage from "../NotFoundPage";
import Header from "./Header";
import Profile from "./Profile";
import VARIANT_PAGE_QUERY from "./VariantPage.gql";

function VariantPage(): ReactElement {
  const location = useLocation();
  const { varId } = useParams() as { varId: string };

  const { loading, data } = useQuery(VARIANT_PAGE_QUERY, {
    variables: { variantId: varId },
  });

  if (data && !data.variant) {
    return <NotFoundPage />;
  }

  return (
    <BasePage
      title={`${varId} profile page`}
      description={`Annotation information for ${varId}`}
      location={location}
    >
      <>
        <Header loading={loading} variantId={varId} variantPageData={data?.variant} />
        <ScrollToTop />

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={location.pathname}>
            <Tab
              label={<Box sx={{ textTransform: "capitalize" }}>Profile</Box>}
              value={`/variant/${varId}`}
              component={Link}
              to={`/variant/${varId}`}
            />
          </Tabs>
        </Box>
        <Profile varId={varId} />
      </>
    </BasePage>
  );
}

export default VariantPage;
