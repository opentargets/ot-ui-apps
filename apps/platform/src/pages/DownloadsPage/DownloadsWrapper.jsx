import { Suspense, lazy } from 'react';
import { LoadingBackdrop, BasePage } from 'ui';

const DownloadsPage = lazy(() => import('./DownloadsPage'));

function DownloadsWrapper({ location }) {
  return (
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
}

export default DownloadsWrapper;
