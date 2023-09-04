import { useState } from 'react';
import AggregationsTooltip from './AggregationsTooltip';
import { grouped as assocGrouped } from '../static_datasets/dataSourcesAssoc';
import { grouped as prioritizationGrouped } from '../static_datasets/prioritizationCols';

function AggregationItem({
  aggregation,
  dataset,
  active,
  handleAggregationClick,
  activeHeadersControlls,
}) {
  const [open, setOpen] = useState(false);
  const onMouseEnter = () => {
    setOpen(true);
  };

  const onMouseLeave = () => {
    setOpen(false);
  };

  const colsCont = dataset[aggregation].length;
  const style = {
    flexGrow: colsCont,
  };
  const isActive = active === aggregation;
  const className = `aggregation-indicator ${isActive && 'active'} ${
    activeHeadersControlls && 'clickAble'
  } `;
  return (
    <div
      className={className}
      style={style}
      onMouseEnter={e => onMouseEnter(aggregation)}
      onMouseLeave={e => onMouseLeave()}
      onClick={() => {
        if (activeHeadersControlls) return handleAggregationClick(aggregation);
        return () => ({});
      }}
    >
      <AggregationsTooltip
        title={aggregation}
        open={active === aggregation || open}
      >
        <div style={{ width: '100%' }} />
      </AggregationsTooltip>
    </div>
  );
}

function AggregationsRow({
  table,
  active,
  handleAggregationClick,
  activeHeadersControlls,
}) {
  const dataset =
    table === 'associations' ? assocGrouped : prioritizationGrouped;
  const aggregations = Object.keys(dataset);

  return (
    <div className="aggregations-container">
      {aggregations.map(aggregation => (
        <AggregationItem
          key={aggregation}
          aggregation={aggregation}
          active={active}
          dataset={dataset}
          handleAggregationClick={handleAggregationClick}
          activeHeadersControlls={activeHeadersControlls}
        />
      ))}
    </div>
  );
}

export default AggregationsRow;
