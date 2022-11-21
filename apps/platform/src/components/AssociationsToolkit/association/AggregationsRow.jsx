import Tooltip from '@material-ui/core/Tooltip';
import dataSources from '../static_datasets/dataSourcesAssoc';

const colors = {
  somatic_mutations: '#bebada',
  genetic_association: '#b3de69',
  known_drug: '#fdb462',
  affected_pathway: '#8dd3c7',
  literature: '#ffffb3',
  rna_expression: '#bc80bd',
  animal_model: '#d9d9d9',
  ot_partner: '#fccde5',
  ot_validation_lab: '#fb8072',
};

const colors2 = {
  somatic_mutations: '#cab2d6',
  genetic_association: '#33a02c',
  known_drug: '#ff7f00',
  affected_pathway: '#fb9a99',
  literature: '#fdbf6f',
  rna_expression: '#6a3d9a',
  animal_model: '#d9d9d9',
  ot_partner: '#cab2d6',
  ot_validation_lab: '#e31a1c',
};

function AggregationsRow({ cols }) {
  return (
    <div className="aggregations-container">
      {cols.map(({ id }) => {
        if (id === 'name') return null;
        if (id === 'score') return null;
        const dataSource = dataSources.filter(el => el.id === id)[0];
        const { aggregation } = dataSource;
        const style = { backgroundColor: colors2[aggregation] };
        return (
          <Tooltip title={aggregation} key={id}>
            <div className="aggregation-indicator">
              <div style={style}></div>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}

export default AggregationsRow;
