import { useQuery } from "@apollo/client";
import { SectionItem } from "ui";

import { definition } from ".";
import Description from "./Description";
import PhenotypesTable from "./PhenotypesTable";

import MOUSE_PHENOTYPES_QUERY from "./MousePhenotypes.gql";

function Body({ id, label: symbol, entity }) {
  const variables = { ensemblId: id };
  const request = useQuery(MOUSE_PHENOTYPES_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => <Description symbol={symbol} />}
      renderBody={({ target }) => (
        <PhenotypesTable
          mousePhenotypes={target.mousePhenotypes}
          query={MOUSE_PHENOTYPES_QUERY.loc.source.body}
          variables={variables}
          symbol={symbol}
        />
      )}
    />
  );
}

export default Body;
