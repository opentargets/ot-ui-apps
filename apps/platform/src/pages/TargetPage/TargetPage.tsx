import { ReactElement, Suspense } from "react";
import { useQuery } from "@apollo/client";
import { Box, Tab, Tabs } from "@mui/material";
import {
  Link,
  Route,
  Switch,
  useLocation,
  useRouteMatch,
  useParams,
  Redirect,
} from "react-router-dom";
import { LoadingBackdrop, BasePage, ScrollToTop } from "ui";

import Header from "./Header";
import NotFoundPage from "../NotFoundPage";
import { getUniprotIds } from "../../utils/global";
import TARGET_PAGE_QUERY from "./TargetPage.gql";

import Profile from "./Profile";
import Associations from "./TargetAssociations";

type TargetURLParams = {
  ensgId: string;
};

function TargetPage(): ReactElement {
  const location = useLocation();
  const { ensgId } = useParams<TargetURLParams>();
  const { path } = useRouteMatch();

  const { loading, data } = useQuery(TARGET_PAGE_QUERY, {
    variables: { ensgId },
  });

  if (data && !data.target) {
    return <NotFoundPage />;
  }

  const { approvedSymbol: symbol, approvedName } = data?.target || {};
  const uniprotIds = loading ? null : getUniprotIds(data.target.proteinIds);
  const crisprId = data?.target.dbXrefs.find(p => p.source === "ProjectScore")?.id;

  return (
    <BasePage
      title={
        location.pathname.includes("associations")
          ? `Diseases associated with ${symbol}`
          : `${symbol} profile page`
      }
      description={
        location.pathname.includes("associations")
          ? `Ranked list of diseases and phenotypes associated with ${symbol}`
          : `Annotation information for ${symbol}`
      }
      location={location}
    >
      <ScrollToTop />
      <Header
        loading={loading}
        ensgId={ensgId}
        uniprotIds={uniprotIds}
        symbol={symbol}
        name={approvedName}
        crisprId={crisprId}
      />

      <Route
        path="/"
        render={history => (
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={history.location.pathname !== "/" ? history.location.pathname : false}>
              <Tab
                label={
                  <Box sx={{ textTransform: "capitalize" }}>
                    <div>Associated diseases</div>
                  </Box>
                }
                value={`/target/${ensgId}/associations`}
                component={Link}
                to={`/target/${ensgId}/associations`}
              />
              <Tab
                label={<Box sx={{ textTransform: "capitalize" }}>Profile</Box>}
                value={`/target/${ensgId}`}
                component={Link}
                to={`/target/${ensgId}`}
              />
            </Tabs>
          </Box>
        )}
      />
      <Suspense fallback={<LoadingBackdrop height={11500} />}>
        <Switch>
          <Route exact path={path}>
            <Profile ensgId={ensgId} symbol={symbol} />
          </Route>
          <Route path={`${path}/associations`}>
            <Associations ensgId={ensgId} />
          </Route>
          <Route path="*">
            <Redirect to={`/target/${ensgId}`} />
          </Route>
        </Switch>
      </Suspense>
    </BasePage>
  );
}

export default TargetPage;
