import { useQuery } from "@apollo/client";
import { SectionItem } from "ui";

import { definition } from ".";
import Description from "./Description";
import PathwaysTable from "./PathwaysTable";

import PATHWAYS_QUERY from "./Pathways.gql";

function Body({ id: ensemblId, label: symbol, entity }) {
  const variables = { ensemblId };
  const request = useQuery(PATHWAYS_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => <Description symbol={symbol} />}
      renderBody={({ target }) => (
        <PathwaysTable
          symbol={target.approvedSymbol}
          pathways={target.pathways}
          query={PATHWAYS_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );
}

export default Body;
