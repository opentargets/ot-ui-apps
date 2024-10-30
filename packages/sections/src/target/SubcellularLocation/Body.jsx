import { useQuery } from "@apollo/client";
import { SectionItem } from "ui";

import { definition } from ".";
import Description from "./Description";
import SUBCELLULAR_LOCATION_QUERY from "./SubcellularLocation.gql";
import SubcellularViz from "./SubcellularViz";

function Body({ id: ensemblId, label: symbol, entity }) {
  const request = useQuery(SUBCELLULAR_LOCATION_QUERY, {
    variables: { ensemblId },
  });

  return (
    <SectionItem
      entity={entity}
      definition={definition}
      request={request}
      renderDescription={() => <Description symbol={symbol} />}
      showContentLoading={true}
      renderBody={() => <SubcellularViz data={request.data?.target} />}
    />
  );
}

export default Body;
