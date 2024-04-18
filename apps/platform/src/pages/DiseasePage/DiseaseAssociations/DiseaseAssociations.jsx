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
// import { ApiPlaygroundDrawer } from "ui";
import { ENTITIES } from "../../../components/AssociationsToolkit/context/types";

// function AssociationsWrapper() {
//   const {
//     initialLoading,
//     id,
//     // pagination,
//     // searhFilter,
//     // sorting,
//     // enableIndirect,
//     // dataSourcesWeights,
//     // entity,
//     // dataSourcesRequired,
//   } = useAotfContext();

//   // const aggregationFilters = dataSourcesRequired.map(({ id, ...obj }) => ({ ...obj }));

//   // const variables = {
//   //   id,
//   //   index: pagination.pageIndex,
//   //   size: pagination.pageSize,
//   //   filter: searhFilter,
//   //   sortBy: sorting[0].id,
//   //   enableIndirect,
//   //   datasources: dataSourcesWeights,
//   //   entity,
//   //   aggregationFilters,
//   // };

//   if (initialLoading) return <AotFLoader />;

//   return (
//     <>
//       <ControlsSection>
//         <Box sx={{ display: "flex", flexWrap: "wrap" }}>
//           <SearhInput />
//           <OptionsControlls>
//             <AdvanceOptionsMenu />
//             <PrivateWrapper>
//               <DataUploader />
//             </PrivateWrapper>
//             <Divider orientation="vertical" />
//             <DataDownloader fileStem={`OT-${id}-associated-targets`} />
//             {/* <ApiPlaygroundDrawer
//               query={DISEASE_ASSOCIATIONS_QUERY.loc.source.body}
//               variables={variables}
//             /> */}
//           </OptionsControlls>
//         </Box>
//         <Box>
//           <TargetPrioritisationSwitch />
//         </Box>
//       </ControlsSection>
//       <TableAssociations />
//     </>
//   );
// }

/* DISEASE ASSOCIATION  */
function DiseaseAssociations({ efoId }) {
  return (
    <AssociationsProvider id={efoId} entity={ENTITIES.DISEASE} query={DISEASE_ASSOCIATIONS_QUERY}>
      <ControlsSection>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <SearhInput />
          <OptionsControlls>
            <AdvanceOptionsMenu />
            <PrivateWrapper>
              <DataUploader />
            </PrivateWrapper>
            <Divider orientation="vertical" />
            <DataDownloader fileStem={`OT-${efoId}-associated-targets`} />
            {/* <ApiPlaygroundDrawer
              query={DISEASE_ASSOCIATIONS_QUERY.loc.source.body}
              variables={variables}
            /> */}
          </OptionsControlls>
        </Box>
        <Box>
          <TargetPrioritisationSwitch />
        </Box>
      </ControlsSection>
      <TableAssociations />
    </AssociationsProvider>
  );
}

export default DiseaseAssociations;
