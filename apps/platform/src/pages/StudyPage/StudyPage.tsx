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
import { getStudyCategory } from "sections/src/utils/getStudyCategory";

function StudyPage() {
  const location = useLocation();
  const { studyId } = useParams() as { studyId: string };
  const { path } = useRouteMatch();

  const { loading, data } = useQuery(STUDY_PAGE_QUERY, {
    variables: { studyId },
  });

  const studyInfo = data?.gwasStudy?.[0];

  if (data && !studyInfo) {
    return <NotFoundPage />;
  }

  const studyCategory = getStudyCategory(studyInfo?.projectId);

  return (
    <BasePage
      title={`${studyId} profile page`}
      description={`Annotation information for ${studyId}`}
      location={location}
    >
      <Header
        loading={loading}
        studyId={studyId}
        backgroundTraits={studyInfo?.backgroundTraits}
        targetId={studyInfo?.target?.id}
        diseases={studyInfo?.diseases}
        studyCategory={studyCategory}
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
          <Profile studyId={studyId} studyCategory={studyCategory} diseases={studyInfo?.diseases} />
        </Route>
        <Route path="*">
          <Redirect to={`/study/${studyId}`} />
        </Route>
      </Switch>
    </BasePage>
  );
}

export default StudyPage;
