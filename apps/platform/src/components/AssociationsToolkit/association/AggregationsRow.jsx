import AggregationsTooltip from './AggregationsTooltip';
import { grouped as assocGrouped } from '../static_datasets/dataSourcesAssoc';
import { grouped as prioritizationGrouped } from '../static_datasets/prioritizationCols';

function AggregationsRow({ table }) {
  const dataset =
    table === 'associations' ? assocGrouped : prioritizationGrouped;
  const aggregations = Object.keys(dataset);
  return (
    <div className="aggregations-container">
      {aggregations.map(aggregation => {
        const colsCont = dataset[aggregation].length;
        const style = { flexGrow: colsCont };
        return (
          <AggregationsTooltip title={aggregation} key={aggregation}>
            <div className="aggregation-indicator" style={style}></div>
          </AggregationsTooltip>
        );
      })}
    </div>
  );
}

export default AggregationsRow;
