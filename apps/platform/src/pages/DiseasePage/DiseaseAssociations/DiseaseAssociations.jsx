import { PrivateWrapper } from "ui";
import { Box, Divider } from "@mui/material";
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
  DataUploader,
} from "../../../components/AssociationsToolkit";
import DISEASE_ASSOCIATIONS_QUERY from "./DiseaseAssociationsQuery.gql";
import CopyUrlButton from "../../../components/AssociationsToolkit/CopyUrlButton";
import ApiPlaygroundDrawer from "ui/src/components/ApiPlaygroundDrawer";

function AssociationsWrapper() {
  const {
    initialLoading,
    id,
    pageIndex,
    pageSize,
    searhFilter,
    sorting,
    enableIndirect,
    dataSourcesWeights,
    entity,
    dataSourcesRequired,
  } = useAotfContext();

  const variables = {
    id,
    index: pageIndex,
    size: pageSize,
    filter: searhFilter,
    sortBy: sorting[0].id,
    enableIndirect,
    datasources: dataSourcesWeights,
    entity,
    aggregationFilters: dataSourcesRequired,
  };

  console.log(DISEASE_ASSOCIATIONS_QUERY);

  if (initialLoading) return <AotFLoader />;

  return (
    <>
      <ControlsSection>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <SearhInput />
          <OptionsControlls>
            <AdvanceOptionsMenu />
            <PrivateWrapper>
              <DataUploader />
            </PrivateWrapper>
            <Divider orientation="vertical" />
            <DataDownloader fileStem={`OT-${id}-associated-targets`} />
            <CopyUrlButton />
          </OptionsControlls>
        </Box>
        <Box>
          <ApiPlaygroundDrawer
            query={DISEASE_ASSOCIATIONS_QUERY.loc.source.body}
            variables={variables}
          />
          <TargetPrioritisationSwitch />
        </Box>
      </ControlsSection>
      <TableAssociations />
    </>
  );
}

/* DISEASE ASSOCIATION  */
function DiseaseAssociations({ efoId }) {
  return (
    <AssociationsProvider id={efoId} entity="disease" query={DISEASE_ASSOCIATIONS_QUERY}>
      <AssociationsWrapper />
    </AssociationsProvider>
  );
}

export default DiseaseAssociations;
