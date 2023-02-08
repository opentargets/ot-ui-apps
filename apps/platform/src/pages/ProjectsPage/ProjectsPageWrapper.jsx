import { Suspense, lazy } from 'react';
import { LoadingBackdrop } from 'ui';
import BasePage from '../../components/BasePage';

const ProjectPage = lazy(() => import('./ProjectsPage.jsx'));

const ProjectsPageWrapper = ({ location }) => (
  <BasePage
    title="Projects page | Open Targets Platform"
    description="Projects page | Open Targets Platform"
    location={location}
  >
    <Suspense fallback={<LoadingBackdrop />}>
      <ProjectPage />
    </Suspense>
  </BasePage>
);

export default ProjectsPageWrapper;
