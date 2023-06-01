import React from 'react';
import { useQuery } from '@apollo/client';
import Description from './Description';
import SectionItem from '../../../components/Section/SectionItem';
import DepmapPlot from './DepmapPlot';

import DEPMAP_QUERY from './Depmap.gql';

// TODO: temporary sample data
import data0 from './data/data.json';

function Section({ definition, id, label: symbol }) {
  const variables = { ensemblId: id };
  const request = useQuery(DEPMAP_QUERY, { variables });

  const { depMapEssentiality } = data0;

  return (
    <SectionItem
      definition={definition}
      request={request}
      renderDescription={() => <Description symbol={symbol} />}
      renderBody={data => {
        // TODO: depMapEssentiality will come from data
        return (
          <>
            <DepmapPlot data={depMapEssentiality} />
          </>
        );
      }}
    />
  );
}

export default Section;
