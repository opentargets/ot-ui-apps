import { Suspense, lazy } from 'react';
import { LoadingBackdrop, BasePage } from 'ui';

const ProjectPage = lazy(() => import('./ProjectsPage'));

function ProjectsPageWrapper({ location }) {
  return (
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
}

export default ProjectsPageWrapper;
