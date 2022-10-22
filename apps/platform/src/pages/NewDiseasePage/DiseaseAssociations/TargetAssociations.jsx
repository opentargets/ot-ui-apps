import TableAssociations from './TableAssociations';
import AdvanceOptionsMenu from './AdvanceOptionsMenu';
import AssociationsProvider, {
  AssociationsContext,
} from './AssociationsProvider';
import { LoadingBackdrop } from 'ui';
import './style.css';
import { useContext } from 'react';

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

/* TARGET ASSOCIATION  */
function TargetAssociations({ ensgId }) {
  return (
    <AssociationsProvider ensgId={ensgId}>
      <AssociationsWrapper />
    </AssociationsProvider>
  );
}

export default TargetAssociations;
