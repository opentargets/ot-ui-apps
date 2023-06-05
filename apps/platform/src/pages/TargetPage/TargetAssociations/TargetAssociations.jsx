import { LoadingBackdrop } from 'ui';
import { useContext } from 'react';
import {
  TableAssociations,
  AdvanceOptionsMenu,
  AssociationsContext,
  AssociationsProvider,
  SearhInput,
  DataDownloader,
} from '../../../components/AssociationsToolkit';
import TARGET_ASSOCIATIONS_QUERY from './TargetAssociationsQuery.gql';

function AssociationsWrapper() {
  const { initialLoading, id } = useContext(AssociationsContext);
  if (initialLoading)
    return (
      <div className="TAssociations loading-container">
        <LoadingBackdrop />
      </div>
    );

  return (
    <>
      <div className="ControlsSection">
        <div className="global-controls-container">
          <SearhInput />
          <div className="options-controls">
            <AdvanceOptionsMenu />
            <DataDownloader fileStem={`${id}-associated-diseases`} />
          </div>
        </div>
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
