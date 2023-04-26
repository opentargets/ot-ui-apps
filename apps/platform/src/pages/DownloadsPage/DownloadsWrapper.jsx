import { Suspense, lazy } from 'react';
import { LoadingBackdrop } from 'ui';
import BasePage from '../../components/BasePage';

const DownloadsPage = lazy(() => import('./DownloadsPage.jsx'));

function DownloadsWrapper({ location }) {
  return <BasePage
    title="Data downloads | Open Targets Platform"
    description="Data downloads | Open Targets Platform"
    location={location}
  >
    <Suspense fallback={<LoadingBackdrop />}>
      <DownloadsPage />
    </Suspense>
  </BasePage>
}

export default DownloadsWrapper;
