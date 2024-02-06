import { useContext } from "react";
import { PrivateWrapper } from "ui";
import { Box, Divider } from "@mui/material";
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
  DataUploader,
} from "../../../components/AssociationsToolkit";
import TARGET_ASSOCIATIONS_QUERY from "./TargetAssociationsQuery.gql";
import { ApiPlaygroundDrawer } from "ui";

function AssociationsWrapper() {
  const {
    initialLoading,
    id,
    pagination,
    searhFilter,
    sorting,
    enableIndirect,
    dataSourcesWeights,
    entity,
    dataSourcesRequired,
  } = useContext(AssociationsContext);

  const variables = {
    id,
    index: pagination.pageIndex,
    size: pagination.pageSize,
    filter: searhFilter,
    sortBy: sorting[0].id,
    enableIndirect,
    datasources: dataSourcesWeights,
    entity,
    aggregationFilters: dataSourcesRequired,
  };

  if (initialLoading) return <AotFLoader />;

  return (
    <>
      <ControlsSection>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <SearhInput />
          <OptionsControlls>
            <AdvanceOptionsMenu />
            {/* <PrivateWrapper> */}
            <DataUploader />
            {/* </PrivateWrapper> */}
            <Divider orientation="vertical" />
            <DataDownloader fileStem={`OT-${id}-associated-diseases`} />
            <ApiPlaygroundDrawer
              query={TARGET_ASSOCIATIONS_QUERY.loc.source.body}
              variables={variables}
            />
          </OptionsControlls>
        </Box>
        <Box></Box>
      </ControlsSection>
      <TableAssociations />
    </>
  );
}

/* TARGET ASSOCIATION  */
function TargetAssociations({ ensgId }) {
  return (
    <AssociationsProvider id={ensgId} entity="target" query={TARGET_ASSOCIATIONS_QUERY}>
      <AssociationsWrapper />
    </AssociationsProvider>
  );
}

export default TargetAssociations;
