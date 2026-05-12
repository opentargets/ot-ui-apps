import { useState } from "react";
import { flexRender } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownWideShort, faBook, faLock } from "@fortawesome/free-solid-svg-icons";
import { Grid } from "@mui/material";

import AggregationsRow from "./AggregationsRow";
import { useAotfQueryState, useAotfQueryDispatch } from "../../context/AssociationsQueryContext";
import { useAotfURLState } from "../../context/AssociationsURLContext";
import { GridContainer, NaimingHeaderZone, MetricsHeaderZone, TheaderContainer } from "../layout";

function HeaderZone({ id, columnsCount, children, ...props }) {
  if (id.includes("naiming-cols")) return <NaimingHeaderZone {...props}>{children}</NaimingHeaderZone>;
  if (id.includes("metrics-cols")) return <MetricsHeaderZone {...props}>{children}</MetricsHeaderZone>;
  return <GridContainer columnsCount={columnsCount} {...props}>{children}</GridContainer>;
}

const getHeaderClassName = ({ id }) => {
  if (id === "name") return "header-name";
  if (id === "score") return "rotate header-score";
  return "rotate";
};

function TableHeader({ table, cols }) {
  const { id } = useAotfQueryState();
  const { displayedTable, setActiveHeadersControlls } = useAotfURLState();
  const { handleAggregationClick } = useAotfQueryDispatch();
  const [activeAggregation, setActiveAggegation] = useState(null);
  const onEnterHoverHeader = ({ id: elementId, column }) => {
    if (elementId === "score" || elementId === "name") return;
    const { aggregation } = column.columnDef;
    setActiveAggegation(aggregation);
  };

  const onLeaveHoverHeader = () => {
    if (id === "score" || id === "name") return;
    setActiveAggegation(null);
  };

  const highLevelHeaders = table.getHeaderGroups()[0].headers;

  return (
    <TheaderContainer data-testid="associations-table-header">
      <Grid container direction="row" wrap="nowrap">
        {highLevelHeaders.map(highLevelHeader => (
          <HeaderZone
            id={highLevelHeader.id}
            columnsCount={cols.length}
            key={highLevelHeader.id}
          >
            {highLevelHeader.subHeaders.map(header => (
              <div className={getHeaderClassName(header)} key={header.id}>
                {header.isPlaceholder ? null : (
                  <div
                    className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                    onMouseEnter={() => onEnterHoverHeader(header)}
                    onMouseLeave={() => onLeaveHoverHeader()}
                  >
                    <div onClick={header.column.getToggleSortingHandler()}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                    {header.column.columnDef.isPrivate && (
                      <FontAwesomeIcon className="header-desc-icon" icon={faLock} />
                    )}
                    {{
                      desc: (
                        <FontAwesomeIcon className="header-desc-icon" icon={faArrowDownWideShort} />
                      ),
                    }[header.column.getIsSorted()] ?? null}
                    {header.column.columnDef.docsLink && (
                      <a
                        rel="noreferrer"
                        target="_blank"
                        className="docs-link"
                        href={header.column.columnDef.docsLink}
                      >
                        <FontAwesomeIcon className="header-desc-icon" icon={faBook} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </HeaderZone>
        ))}
      </Grid>
      <AggregationsRow
        handleAggregationClick={handleAggregationClick}
        columnsCount={cols.length}
        table={displayedTable}
        active={activeAggregation}
        setActiveHeadersControlls={setActiveHeadersControlls}
      />
    </TheaderContainer>
  );
}

export default TableHeader;
