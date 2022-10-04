import { Suspense, lazy } from 'react';
import { LoadingBackdrop } from 'ui';
import BasePage from '../../components/BasePage';

const VariantsPage = lazy(() => import('./VariantsPage.jsx'));

const VariantsWrapper = ({ location }) => (
  <BasePage
    title="Variant definitions"
    description="Variant definitions, including Sequence Ontology (SO) consequence terms, descriptions, and accession IDs"
    location={location}
  >
    <Suspense fallback={<LoadingBackdrop />}>
      <VariantsPage />
    </Suspense>
  </BasePage>
);

export default VariantsWrapper;
