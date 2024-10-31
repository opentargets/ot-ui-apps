import { useQuery } from "@apollo/client";
import { useLocation, useParams, Switch, Route, useRouteMatch, Link } from "react-router-dom";
import { Box, Tabs, Tab } from "@mui/material";
import { BasePage, ScrollToTop } from "ui";
import Header from "./Header";
import NotFoundPage from "../NotFoundPage";
import VARIANT_PAGE_QUERY from "./VariantPage.gql";
import Profile from "./Profile";

function VariantPage() {
  const location = useLocation();
  const { varId } = useParams() as { varId: string };
  const { path } = useRouteMatch();

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
      <Header loading={loading} variantId={varId} variantPageData={data?.variant} />
      <ScrollToTop />
      <Route
        path="/"
        render={history => (
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={history.location.pathname !== "/" ? history.location.pathname : false}>
              <Tab
                label={<Box sx={{ textTransform: "capitalize" }}>Profile</Box>}
                value={`/variant/${varId}`}
                component={Link}
                to={`/variant/${varId}`}
              />
            </Tabs>
          </Box>
        )}
      />

      <Switch>
        <Route exact path={path}>
          <Profile varId={varId} />
        </Route>
      </Switch>
    </BasePage>
  );
}

export default VariantPage;
