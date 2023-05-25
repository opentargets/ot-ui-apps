import React from 'react';
// import { makeStyles } from '@material-ui/core';
import { useQuery } from '@apollo/client';

// import ChipList from '../../../components/ChipList';
import Description from './Description';
// import DataTable from '../../../components/Table/DataTable';
// import { PublicationsDrawer } from '../../../components/PublicationsDrawer';
import SectionItem from '../../../components/Section/SectionItem';
// import { defaultRowsPerPageOptions } from '../../../constants';

import DEPMAP_QUERY from './Depmap.gql';

import data0 from "./data/data.json";
// import BarChart from './BarChart';
import PlotlyTest from './PlotlyTest';
import DepmapPlot from './DepmapPlot';

// const useStyles = makeStyles({
//   roleInCancerBox: {
//     display: 'flex',
//     alignItems: 'center',
//     marginBottom: '2rem',
//   },
//   roleInCancerTitle: { marginRight: '.5rem' },
// });

function Section({ definition, id, label: symbol }) {
  const variables = { ensemblId: id };
  const request = useQuery(DEPMAP_QUERY, { variables });

  const {depMapEssentiality} = data0;

  return (
    <SectionItem
      definition={definition}
      request={request}
      renderDescription={() => <Description symbol={symbol} />}
      renderBody={data => {
        console.log('target data: ', data);
        console.log('data0: ', data0);
        return (
          <>
            <DepmapPlot data={depMapEssentiality}/>
          </>
        );
      }}
    />
  );
}

export default Section;
