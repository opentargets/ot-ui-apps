import { useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDownWideShort,
  faBook,
} from '@fortawesome/free-solid-svg-icons';

import AggregationsRow from './AggregationsRow';
import useAotfContext from '../hooks/useAotfContext';

const getHeaderContainerClassName = ({ id }) => {
  if (id === '1_naiming-cols_name') return 'naiming-cols';
  return 'entity-cols';
};

const getHeaderClassName = ({ id }) => {
  if (id === 'name') return 'header-name';
  if (id === 'score') return 'rotate header-score';
  return 'rotate';
};

function TableHeader({ table }) {
  const { id, displayedTable, handleAggregationClick, activeWeightsControlls } =
    useAotfContext();
  const [activeAggregation, setActiveAggegation] = useState(null);
  const onEnterHoverHeader = ({ id, column }) => {
    if (id === 'score' || id === 'name') return;
    const aggregation = column.columnDef.aggregation;
    setActiveAggegation(aggregation);
  };

  const onLeaveHoverHeader = () => {
    if (id === 'score' || id === 'name') return;
    setActiveAggegation(null);
  };

  const highLevelHeaders = table.getHeaderGroups()[0].headers;
  const entitesHeaders = table.getHeaderGroups()[0].headers[1].subHeaders;

  return (
    <div className="Theader">
      <div className="cols-container">
        {highLevelHeaders.map(highLevelHeader => (
          <div
            className={getHeaderContainerClassName(highLevelHeader)}
            key={highLevelHeader.id}
          >
            {highLevelHeader.subHeaders.map(header => (
              <div className={getHeaderClassName(header)} key={header.id}>
                {header.isPlaceholder ? null : (
                  <div
                    {...{
                      className: header.column.getCanSort()
                        ? 'cursor-pointer select-none'
                        : '',
                    }}
                    onMouseEnter={_ => onEnterHoverHeader(header)}
                    onMouseLeave={_ => onLeaveHoverHeader()}
                  >
                    <div
                      {...{
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                    {{
                      desc: (
                        <FontAwesomeIcon
                          className="header-desc-icon"
                          icon={faArrowDownWideShort}
                        />
                      ),
                    }[header.column.getIsSorted()] ?? null}
                    <a
                      rel="noreferrer"
                      target="_blank"
                      className="docs-link"
                      href={`https://platform-docs.opentargets.org/evidence#${header.id}`}
                    >
                      <FontAwesomeIcon
                        className="header-desc-icon"
                        icon={faBook}
                      />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <AggregationsRow
        handleAggregationClick={handleAggregationClick}
        cols={entitesHeaders}
        table={displayedTable}
        active={activeAggregation}
        activeWeightsControlls={activeWeightsControlls}
      />
    </div>
  );
}

export default TableHeader;
