import {
  TableAssociations,
  AdvanceOptionsMenu,
  TargetPrioritisationSwitch,
  TableTargetPrioritisation,
} from '../../../components/AssociationsToolkit';
import AssociationsProvider, {
  AssociationsContext,
} from '../../../components/AssociationsToolkit/provider';
import { LoadingBackdrop } from 'ui';
import { useContext } from 'react';
import DISEASE_ASSOCIATIONS_QUERY from './DiseaseAssociationsQuery.gql';

function AssociationsWrapper() {
  const { initialLoading, displayedTable } = useContext(AssociationsContext);

  const tableToDisplay = () => {
    if (displayedTable === 'associations') return <TableAssociations />;
    if (displayedTable === 'prioritisations')
      return <TableTargetPrioritisation />;
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
        <TargetPrioritisationSwitch />
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
