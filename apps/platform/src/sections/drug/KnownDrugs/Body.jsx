import { Body as KnownDrugsBody } from '../../common/KnownDrugs';
import Description from './Description';

import KNOWN_DRUGS_BODY_QUERY from './KnownDrugsQuery.gql';

const exportColumns = [
  {
    label: 'diseaseId',
    exportValue: row => row.disease.id,
  },
  {
    label: 'diseaseName',
    exportValue: row => row.disease.name,
  },
  {
    label: 'symbol',
    exportValue: row => row.target.approvedSymbol,
  },
  {
    label: 'name',
    exportValue: row => row.target.approvedName,
  },
  {
    label: 'phase',
    exportValue: row => row.phase,
  },
  {
    label: 'status',
    exportValue: row => row.status,
  },
  {
    label: 'source',
    exportValue: row => row.urls.map(reference => reference.url),
  },
];

function Body({ definition, id: chemblId, label: name }) {
  return (
    <KnownDrugsBody
      definition={definition}
      entity="drug"
      variables={{ chemblId }}
      BODY_QUERY={KNOWN_DRUGS_BODY_QUERY}
      // eslint-disable-next-line
      Description={() => <Description name={name} />}
      columnsToShow={['disease', 'target', 'clinicalTrials']}
      stickyColumn="disease"
      exportColumns={exportColumns}
    />
  );
}

export default Body;
