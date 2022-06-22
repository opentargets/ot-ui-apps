import React from 'react';
import { useQuery } from '@apollo/client';

import Description from './Description';
import SectionItem from '../../../components/Section/SectionItem';

import SUBCELLULAR_LOCATION_QUERY from './SubcellularLocation.gql';
import SubcellularViz from './SubcellularViz';

function Body({ definition, id: ensemblId, label: symbol }) {
  const request = useQuery(SUBCELLULAR_LOCATION_QUERY, {
    variables: { ensemblId },
  });

  return (
    <SectionItem
      definition={definition}
      request={request}
      renderDescription={() => <Description symbol={symbol} />}
      renderBody={({ target }) => {
        return (
          <>
            <SubcellularViz data={target} />
          </>
        );
      }}
    />
  );
}

export default Body;
