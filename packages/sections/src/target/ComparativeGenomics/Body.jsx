import { useQuery } from "@apollo/client";
import { SectionItem } from "ui";

import { definition } from ".";
import HomologyTable from "./HomologyTable";
import Description from "./Description";

import COMP_GENOMICS_QUERY from "./CompGenomics.gql";

function Body({ id: ensemblId, label: symbol, entity }) {
  const variables = { ensemblId };
  const request = useQuery(COMP_GENOMICS_QUERY, { variables });
  return (
    <SectionItem
      entity={entity}
      definition={definition}
      request={request}
      renderDescription={() => <Description symbol={symbol} />}
      renderBody={data => (
        <HomologyTable
          homologues={data.target.homologues}
          query={COMP_GENOMICS_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );
}

export default Body;
