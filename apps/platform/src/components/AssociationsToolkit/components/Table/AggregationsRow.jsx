import { useState } from "react";
import { styled, Grid } from "@mui/material";

import AggregationsTooltip from "./AssocTooltip";
import associationsColumns from "../../static_datasets/dataSourcesAssoc";
import prioritizationColumns from "../../static_datasets/prioritisationColumns";
import { groupViewColumnsBy } from "../../utils";
import { GridContainer } from "../layout";

const AggregationsContainer = styled(GridContainer)({
  gridColumnGap: "4px",
});

const HiddenCol = styled("div")({
  width: "var(--table-left-column-width)",
  display: "flex",
});

const associationGrouped = groupViewColumnsBy(associationsColumns, "aggregation");
const prioritizationGrouped = groupViewColumnsBy(prioritizationColumns, "aggregation");

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
  const isActive = active === aggregation || open;
  const className = `aggregation-indicator ${isActive && "active"} clickAble`;
  return (
    <button
      type="button"
      className={className}
      style={style}
      onMouseEnter={() => onMouseEnter(aggregation)}
      onMouseLeave={() => onMouseLeave()}
      onClick={() => onClick()}
    >
      <AggregationsTooltip title={aggregation} open={active === aggregation || open}>
        <div style={{ width: "100%" }} />
      </AggregationsTooltip>
    </button>
  );
}

function AggregationsRow({
  table,
  active,
  handleAggregationClick,
  activeHeadersControlls,
  setActiveHeadersControlls,
  columnsCount,
}) {
  const dataset = table === "associations" ? associationGrouped : prioritizationGrouped;
  const aggregations = Object.keys(dataset);

  return (
    <Grid container direction="row" wrap="nowrap">
      <HiddenCol />
      <AggregationsContainer columnsCount={columnsCount}>
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
    </Grid>
  );
}

export default AggregationsRow;
