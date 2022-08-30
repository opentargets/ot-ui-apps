import { Suspense, lazy } from 'react';
import { LoadingBackdrop } from 'ui';
import BasePage from '../../components/BasePage';

const DownloadsPage = lazy(() => import('./DownloadsPage.jsx'));

const DownloadsWrapper = ({ location }) => (
  <BasePage
    title="Data downloads | Open Targets Platform"
    description="Data downloads | Open Targets Platform"
    location={location}
  >
    <Suspense fallback={<LoadingBackdrop />}>
      <DownloadsPage />
    </Suspense>
  </BasePage>
);

export default DownloadsWrapper;
