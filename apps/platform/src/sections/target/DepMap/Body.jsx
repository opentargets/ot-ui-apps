import { useQuery } from '@apollo/client';
import Description from './Description';
import SectionItem from '../../../components/Section/SectionItem';
import DepmapPlot from './DepmapPlot';

import DEPMAP_QUERY from './Depmap.gql';


function Section({ definition, id, label: symbol }) {
  const variables = { ensemblId: id };
  const request = useQuery(DEPMAP_QUERY, { variables });

  return (
    <SectionItem
      definition={definition}
      request={request}
      renderDescription={() => <Description symbol={symbol} />}
      renderBody={data => {
        return (
          <>
            <DepmapPlot data={data.target.depMapEssentiality} />
          </>
        );
      }}
    />
  );
}

export default Section;
