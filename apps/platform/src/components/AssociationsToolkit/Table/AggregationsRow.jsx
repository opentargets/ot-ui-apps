import { useState } from 'react';
import { styled } from '@material-ui/core';

import AggregationsTooltip from './AggregationsTooltip';
import associationsColumns from '../static_datasets/dataSourcesAssoc';
import prioritizationColumns from '../static_datasets/prioritizationCols';
import { groupViewColumnsBy } from '../utils';
import { GridContainer } from '../layout';

const AggregationsContainer = styled(GridContainer)({
  gridColumnGap: '6px',
});

const associationGrouped = groupViewColumnsBy(
  associationsColumns,
  'aggregation'
);
const prioritizationGrouped = groupViewColumnsBy(
  prioritizationColumns,
  'aggregation'
);

function AggregationItem({
  aggregation,
  dataset,
  active,
  handleAggregationClick,
  setActiveHeadersControlls,
}) {
  const [open, setOpen] = useState(false);
  const onMouseEnter = () => {
    setOpen(true);
  };

  const onMouseLeave = () => {
    setOpen(false);
  };

  const onClick = () => {
    handleAggregationClick(aggregation);
    setActiveHeadersControlls(true);
  };

  const colsCont = dataset[aggregation].length;
  const style = {
    gridColumn: `span ${colsCont}`,
    gridRow: `row1-start / 2`,
  };
  const isActive = active === aggregation;
  const className = `aggregation-indicator ${isActive && 'active'} clickAble`;
  return (
    <div
      className={className}
      style={style}
      onMouseEnter={e => onMouseEnter(aggregation)}
      onMouseLeave={e => onMouseLeave()}
      onClick={() => onClick()}
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
  setActiveHeadersControlls,
}) {
  const dataset =
    table === 'associations' ? associationGrouped : prioritizationGrouped;
  const aggregations = Object.keys(dataset);

  return (
    <div className="aggregations-container">
      <AggregationsContainer>
        {aggregations.map(aggregation => (
          <AggregationItem
            key={aggregation}
            aggregation={aggregation}
            active={active}
            dataset={dataset}
            handleAggregationClick={handleAggregationClick}
            activeHeadersControlls={activeHeadersControlls}
            setActiveHeadersControlls={setActiveHeadersControlls}
          />
        ))}
      </AggregationsContainer>
    </div>
  );
}

export default AggregationsRow;
