import { Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import { LoadingBackdrop, BasePage } from 'ui';

const VariantsPage = lazy(() => import('./VariantsPage'));

function VariantsWrapper() {
  const location = useLocation();
  return (
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
}

export default VariantsWrapper;
