import { useQuery } from "@apollo/client";
import { Box, Tab, Tabs } from "@mui/material";
import type { ReactElement } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { BasePage, ScrollToTop } from "ui";
import NotFoundPage from "../NotFoundPage";
import Header from "./Header";
import Profile from "./Profile";
import STUDY_PAGE_QUERY from "./StudyPage.gql";

function StudyPage(): ReactElement {
  const location = useLocation();
  const { studyId } = useParams() as { studyId: string };

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
      <>
        <Header
          loading={loading}
          studyId={studyId}
          backgroundTraits={study?.backgroundTraits}
          targetId={study?.target?.id}
          diseases={study?.diseases}
          projectId={projectId}
        />
        <ScrollToTop />

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={location.pathname}>
            <Tab
              label={<Box sx={{ textTransform: "capitalize" }}>Profile</Box>}
              value={`/study/${studyId}`}
              component={Link}
              to={`/study/${studyId}`}
            />
          </Tabs>
        </Box>
        <Profile
          studyId={studyId}
          studyType={studyType}
          projectId={projectId}
          diseases={study?.diseases}
        />
      </>
    </BasePage>
  );
}

export default StudyPage;
