import React from 'react';
import { useQuery } from '@apollo/client';

import SectionItem from '../../../components/Section/SectionItem';
import Description from './Description';
import SafetyTable from './SafetyTable';

import SAFETY_QUERY from './Safety.gql';

function Body({ definition, id: ensemblId, label: symbol }) {
  const variables = { ensemblId };
  const request = useQuery(SAFETY_QUERY, { variables });
  return (
    <SectionItem
      definition={definition}
      request={request}
      renderDescription={() => <Description symbol={symbol} />}
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
