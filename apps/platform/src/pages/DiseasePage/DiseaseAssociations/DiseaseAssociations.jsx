import TableAssociations from '../../../components/AssociationsToolkit/TableAssociations';
import AdvanceOptionsMenu from '../../../components/AssociationsToolkit/AdvanceOptionsMenu';
import AssociationsProvider, {
  AssociationsContext,
} from '../../../components/AssociationsToolkit/AssociationsProvider';
import { LoadingBackdrop } from 'ui';
import { useContext } from 'react';
import DISEASE_ASSOCIATIONS_QUERY from './DiseaseAssociationsQuery.gql';

function AssociationsWrapper() {
  const { initialLoading } = useContext(AssociationsContext);
  if (initialLoading)
    return (
      <div className="TAssociations loading-container">
        <LoadingBackdrop />
      </div>
    );

  return (
    <>
      <AdvanceOptionsMenu />
      <TableAssociations />
    </>
  );
}

/* DISEASE ASSOCIATION  */
function DiseaseAssociations({ efoId }) {
  return (
    <AssociationsProvider
      id={efoId}
      entity="disease"
      query={DISEASE_ASSOCIATIONS_QUERY}
    >
      <AssociationsWrapper />
    </AssociationsProvider>
  );
}

export default DiseaseAssociations;
