import { Suspense, lazy } from 'react';
import LoadingBackdrop from '../../components/LoadingBackdrop';
import BasePage from '../../components/BasePage';

const APIPage = lazy(() => import('./APIPage.jsx'));

function APIPageWrapper({ location }) {
  return (
    <BasePage title="API" description="API">
      <Suspense fallback={<LoadingBackdrop />}>
        <APIPage />
      </Suspense>
    </BasePage>
  );
}

export default APIPageWrapper;
