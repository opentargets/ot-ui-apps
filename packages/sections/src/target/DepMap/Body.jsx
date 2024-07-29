import { useQuery } from "@apollo/client";
import { SectionItem } from "ui";

import { definition } from ".";
import Description from "./Description";
import DepmapPlot from "./DepmapPlot";
import DEPMAP_QUERY from "./Depmap.gql";

function Section({ id, label: symbol, entity }) {
  const variables = { ensemblId: id };
  const request = useQuery(DEPMAP_QUERY, { variables });

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => <Description symbol={symbol} />}
      renderBody={data => (
        <DepmapPlot
          data={data.target.depMapEssentiality}
          variables={variables}
          query={DEPMAP_QUERY.loc.source.body}
        />
      )}
    />
  );
}

export default Section;
