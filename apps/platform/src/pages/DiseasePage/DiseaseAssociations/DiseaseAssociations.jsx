import TableAssociations from '../../../components/AssociationsToolkit/TableAssociations';
import AdvanceOptionsMenu from '../../../components/AssociationsToolkit/AdvanceOptionsMenu';
import TargetPrioritizarionSwitch from '../../../components/AssociationsToolkit/TargetPrioritizationSwitch';
import TableTargetPrioritization from '../../../components/AssociationsToolkit/TableTargetPrioritization';
import AssociationsProvider, {
  AssociationsContext,
} from '../../../components/AssociationsToolkit/AssociationsProvider';
import { LoadingBackdrop } from 'ui';
import { useContext } from 'react';
import DISEASE_ASSOCIATIONS_QUERY from './DiseaseAssociationsQuery.gql';

function AssociationsWrapper() {
  const { initialLoading, displayedTable } = useContext(AssociationsContext);

  const tableToDisplay = () => {
    if (displayedTable === 'associations') return <TableAssociations />;
    if (displayedTable === 'prioritizations')
      return <TableTargetPrioritization />;
  };

  if (initialLoading)
    return (
      <div className="TAssociations loading-container">
        <LoadingBackdrop />
      </div>
    );

  return (
    <>
      <div className="ControlsSection">
        <TargetPrioritizarionSwitch />
        <AdvanceOptionsMenu />
      </div>
      {tableToDisplay()}
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
