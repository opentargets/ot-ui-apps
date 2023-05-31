import React from 'react';
import { useQuery } from '@apollo/client';

// import ChipList from '../../../components/ChipList';
import Description from './Description';
// import DataTable from '../../../components/Table/DataTable';
// import { PublicationsDrawer } from '../../../components/PublicationsDrawer';
import SectionItem from '../../../components/Section/SectionItem';
// import { defaultRowsPerPageOptions } from '../../../constants';

import DEPMAP_QUERY from './Depmap.gql';

import data0 from './data/data.json';
import DepmapPlot from './DepmapPlot';

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
