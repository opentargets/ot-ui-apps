import { useQuery } from "@apollo/client";
import { BasePage, ScrollToTop } from "ui";
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
  const { studyId } = useParams() as { studyId: string };
  const { path } = useRouteMatch();

  const { loading, data } = useQuery(STUDY_PAGE_QUERY, {
    variables: { studyId },
  });

  if (data && !data.study) {
    return <NotFoundPage />;
  }
  const study = data?.study;
  const studyType = study?.studyType;
  const projectId = study?.projectId;

  return (
    <BasePage
      title={`${study?.id} profile page`}
      description={`Annotation information for ${study?.id}`}
      location={location}
    >
      <Header
        loading={loading}
        studyId={studyId}
        backgroundTraits={study?.backgroundTraits}
        targetId={study?.target?.id}
        diseases={study?.diseases}
        projectId={projectId}
      />
      <ScrollToTop />

      <Route
        path="/"
        render={history => (
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={history.location.pathname !== "/" ? history.location.pathname : false}>
              <Tab
                label={<Box sx={{ textTransform: "capitalize" }}>Profile</Box>}
                value={`/study/${studyId}`}
                component={Link}
                to={`/study/${studyId}`}
              />
            </Tabs>
          </Box>
        )}
      />

      <Switch>
        <Route exact path={path}>
          <Profile
            studyId={studyId}
            studyType={studyType}
            projectId={projectId}
            diseases={study?.diseases}
          />
        </Route>
        <Route path="*">
          <Redirect to={`/study/${study?.id}`} />
        </Route>
      </Switch>
    </BasePage>
  );
}

export default StudyPage;
