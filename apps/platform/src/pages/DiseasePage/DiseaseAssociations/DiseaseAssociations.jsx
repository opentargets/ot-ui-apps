import { PrivateWrapper } from 'ui';
import { Box } from '@mui/material';
import {
  TableAssociations,
  AdvanceOptionsMenu,
  TargetPrioritisationSwitch,
  AssociationsProvider,
  SearhInput,
  DataDownloader,
  useAotfContext,
  ControlsSection,
  OptionsControlls,
  AotFLoader,
} from '../../../components/AssociationsToolkit';
import DISEASE_ASSOCIATIONS_QUERY from './DiseaseAssociationsQuery.gql';

function AssociationsWrapper() {
  const { initialLoading, id } = useAotfContext();

  if (initialLoading) return <AotFLoader />;

  return (
    <>
      <ControlsSection>
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <SearhInput />
          <OptionsControlls>
            <AdvanceOptionsMenu />
            <DataDownloader fileStem={`${id}-associated-targets`} />
          </OptionsControlls>
        </Box>
        <div>
          <PrivateWrapper>
            <TargetPrioritisationSwitch />
          </PrivateWrapper>
        </div>
      </ControlsSection>
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
