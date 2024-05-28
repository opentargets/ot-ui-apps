import { useState, useEffect, lazy, Suspense } from "react";
import {
  useLocation,
  useParams,
  Switch,
  Route,
  useRouteMatch,
  Link,
} from "react-router-dom";
import { Box, Tabs, Tab } from "@mui/material";
import { BasePage, ScrollToTop, LoadingBackdrop } from "ui";
import Header from "./Header";
import NotFoundPage from "../NotFoundPage";
import { MetadataType } from "./types";

const Profile = lazy(() => import("./Profile"));

function VariantPage() {
  const location = useLocation();
  const { varId } = useParams() as { varId: string };
  const { path } = useRouteMatch();

  // temp: data will come from gql, fetch local json file for now
  const [metadata, setMetadata] = useState<MetadataType | "waiting" | undefined>("waiting");
   useEffect(() => {
      fetch("../data/variant-data-2.json")
        .then(response => response.json())
        .then((allData: MetadataType[]) => setMetadata(allData.find(v => v.variantId === varId)));
    }, []);
  
    // temp: loading is set by useQuery, set to false for now
  const loading = false;

  // temp: revisit this (use same as other pages) once using gql to get data
  if (!metadata) {
    return <NotFoundPage />;
  } else if (metadata === "waiting") {
    return <b>Waiting</b>;
  }

  return (
    <BasePage
      title={`${varId} profile page`}
      description={`Annotation information for ${varId}`}
      location={location}
    >
      <Header loading={loading} metadata={metadata} />
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
      <Suspense fallback={<LoadingBackdrop height={11500} />}>
        <Switch>
          <Route exact path={path}>
            <Profile varId={varId} />
          </Route>
        </Switch>
      </Suspense>
    </BasePage>
  );
}

export default VariantPage;
