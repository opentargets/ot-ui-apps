import { Suspense, lazy } from 'react';
import BasePage from '../BasePage';

const APIPage = lazy(() => import('./APIPage.jsx'));

function APIPageWrapper() {
  return (
    <BasePage title="API" description="API">
      <Suspense fallback={<p>Loading.. //TODO add loader component</p>}>
        <APIPage />
      </Suspense>
    </BasePage>
  );
}

export default APIPageWrapper;
