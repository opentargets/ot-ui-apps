import { SectionItem, usePlatformApi } from "ui";
import { Box } from "@mui/material";

import Description from "./Description";
import { definition } from ".";
import { getUniprotIds } from "../../utils/global";
import ProtVista from "./ProtVista";
import NightingaleVis from "./NightingaleVis";

import PROTVISTA_SUMMARY_FRAGMENT from "./summaryQuery.gql";

function Body({ label: symbol, entity }) {
  const request = usePlatformApi(PROTVISTA_SUMMARY_FRAGMENT);

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={{ ...request, data: { [entity]: request.data } }}
      renderDescription={() => <Description symbol={symbol} />}
      showContentLoading={true}
      renderBody={() => {
        const uniprotId = getUniprotIds(request.data?.proteinIds)[0];
        return (
          <Box display="flex" flexDirection="column" gap={6}>
            <NightingaleVis uniprotId={uniprotId} />
            {/* <Box height="1px" bgcolor="#000" /> */}
            {/* <ProtVista uniprotId={uniprotId} /> */}
          </Box>
        );
      }}
    />
  );
}

export default Body;
