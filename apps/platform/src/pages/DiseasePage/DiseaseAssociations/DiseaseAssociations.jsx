import { LoadingBackdrop } from 'ui';
import {
  TableAssociations,
  AdvanceOptionsMenu,
  TargetPrioritisationSwitch,
  AssociationsProvider,
  SearhInput,
  DataDownloader,
  useAotfContext,
} from '../../../components/AssociationsToolkit';
import DISEASE_ASSOCIATIONS_QUERY from './DiseaseAssociationsQuery.gql';

function AssociationsWrapper() {
  const { initialLoading, id } = useAotfContext();

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
