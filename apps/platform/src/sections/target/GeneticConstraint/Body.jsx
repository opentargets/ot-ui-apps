import React from 'react';
import { useQuery } from '@apollo/client';
import GeneticConstraintTable from './GeneticConstraintTable';

import SectionItem from '../../../components/Section/SectionItem';
import Description from './Description';

import GENETIC_CONSTRAINT from './GeneticConstraint.gql';

function Body({ definition, id: ensemblId, label: symbol }) {
  const variables = { ensemblId };
  const request = useQuery(GENETIC_CONSTRAINT, { variables: { ensemblId } });
  return (
    <SectionItem
      definition={definition}
      request={request}
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
