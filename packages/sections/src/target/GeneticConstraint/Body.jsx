import { SectionItem } from "ui";
import { useQuery } from "@apollo/client";
import GeneticConstraintTable from "./GeneticConstraintTable";

import { definition } from ".";
import Description from "./Description";
import GENETIC_CONSTRAINT from "./GeneticConstraint.gql";

function Body({ id: ensemblId, label: symbol, entity }) {
  const variables = { ensemblId };
  const request = useQuery(GENETIC_CONSTRAINT, { variables: { ensemblId } });
  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => <Description symbol={symbol} />}
      renderBody={({ target }) => (
        <GeneticConstraintTable
          ensemblId={ensemblId}
          symbol={symbol}
          geneticConstraint={target.geneticConstraint}
          query={GENETIC_CONSTRAINT.loc.source.body}
          variables={variables}
        />
      )}
    />
  );
}

export default Body;
