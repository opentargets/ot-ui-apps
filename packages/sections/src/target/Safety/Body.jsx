import { SectionItem } from "ui";
import { useQuery } from "@apollo/client";

import { definition } from ".";
import Description from "./Description";
import SafetyTable from "./SafetyTable";
import SAFETY_QUERY from "./Safety.gql";

function Body({ id: ensemblId, label: symbol, entity }) {
  const variables = { ensemblId };
  const request = useQuery(SAFETY_QUERY, { variables });
  return (
    <SectionItem
      definition={definition}
      request={request}
      renderDescription={() => <Description symbol={symbol} />}
      entity={entity}
      renderBody={data => (
        <SafetyTable
          safetyLiabilities={data.target.safetyLiabilities}
          query={SAFETY_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );
}

export default Body;
