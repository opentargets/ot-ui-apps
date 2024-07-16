import { Suspense } from "react";
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
import STUDY_PAGE_QUERY from "./StudyPage.gql";
import Profile from "./Profile";

function StudyPage() {
  const location = useLocation();
  const { studyId } = useParams();
  const { path } = useRouteMatch();

  const { loading, data } = useQuery(STUDY_PAGE_QUERY, {
    variables: { studyId },
  });

  if (data && !data.gwasStudy) {
    return <NotFoundPage />;
  }

  // !!!!! CURRENTLY RESOLVE STUDY TYPE PURELY FROM PROJECT ID
  const { projectId } = data?.gwasStudy || {};
  let studyType = null;
  if (projectId) {
    if (projectId === "GCST") studyType = "GWAS"
    else if (projectId === "FINNGEN_R10") studyType = "FINNGEN"
    else studyType = "QTL";
  }

  return (
    <BasePage
      title={`${studyId} profile page`}
      description={`Annotation information for ${studyId}`}
      location={location}
    >
      <Header 
        loading={loading}
        studyId={studyId}
        traitFromSource={data?.gwasStudy?.traitFromSource}
        targetId={data?.gwasStudy?.target?.id}
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
                value={`/gwasStudy/${studyId}`}
                component={Link}
                to={`/gwasStudy/${studyId}`}
              />
            </Tabs>
          </Box>
        )}
      />
      <Suspense fallback={<LoadingBackdrop height={11500} />}>
        <Switch>
          <Route exact path={path}>
            <Profile studyId={studyId} studyType={studyType}/>
          </Route>
          <Route path="*">
            <Redirect to={`/gwasStudy/${studyId}`} />
          </Route>
        </Switch>
      </Suspense>
    </BasePage>
  );
}

export default StudyPage;
