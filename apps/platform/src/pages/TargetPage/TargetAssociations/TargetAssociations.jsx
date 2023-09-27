import { useContext } from 'react';
import { Box } from '@mui/material';
import {
  TableAssociations,
  AdvanceOptionsMenu,
  AssociationsContext,
  AssociationsProvider,
  SearhInput,
  DataDownloader,
  ControlsSection,
  OptionsControlls,
  AotFLoader,
} from '../../../components/AssociationsToolkit';
import TARGET_ASSOCIATIONS_QUERY from './TargetAssociationsQuery.gql';

function AssociationsWrapper() {
  const { initialLoading, id } = useContext(AssociationsContext);
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
      </ControlsSection>
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
