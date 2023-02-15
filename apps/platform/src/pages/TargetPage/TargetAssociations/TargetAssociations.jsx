import {
  TableAssociations,
  AdvanceOptionsMenu,
  AssociationsContext,
  AssociationsProvider,
} from '../../../components/AssociationsToolkit';
import { LoadingBackdrop } from 'ui';
import { useContext } from 'react';
import TARGET_ASSOCIATIONS_QUERY from './TargetAssociationsQuery.gql';

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
      <div className="ControlsSection">
        <AdvanceOptionsMenu />
      </div>
      <TableAssociations />
    </>
  );
}

/* TARGET ASSOCIATION  */
function TargetAssociations({ ensgId }) {
  return (
    <AssociationsProvider
      id={ensgId}
      entity="target"
      query={TARGET_ASSOCIATIONS_QUERY}
    >
      <AssociationsWrapper />
    </AssociationsProvider>
  );
}

export default TargetAssociations;
