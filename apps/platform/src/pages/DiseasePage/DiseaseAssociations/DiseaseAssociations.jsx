import { LoadingBackdrop } from 'ui';
import { useContext } from 'react';
import {
  TableAssociations,
  AdvanceOptionsMenu,
  TargetPrioritisationSwitch,
  AssociationsContext,
  AssociationsProvider,
  SearhInput,
  DataDownloader,
} from '../../../components/AssociationsToolkit';
import DISEASE_ASSOCIATIONS_QUERY from './DiseaseAssociationsQuery.gql';

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
            <DataDownloader fileStem={`${id}-associated-targets`} />
          </div>
        </div>
        <div>
          <TargetPrioritisationSwitch />
        </div>
      </div>
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
