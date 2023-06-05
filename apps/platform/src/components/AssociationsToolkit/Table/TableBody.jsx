import { Fragment } from 'react';
import { flexRender } from '@tanstack/react-table';
import { ClickAwayListener } from '@material-ui/core';
import {
  EvidenceSecctionRenderer,
  SecctionRendererWrapper,
  TargetSecctionRenderer,
} from './SectionRender';
import useAotfContext from '../hooks/useAotfContext';

import { getCellId } from '../utils';

/* HELPERS */
const getColContainerClassName = ({ id }) => {
  if (id === '1_naiming-cols_name') return 'group-naiming-cols';
  return 'group-entity-cols';
};

const getRowClassName = ({ getIsExpanded }) => {
  const activeClass = getIsExpanded() ? 'active' : '';
  return `data-row ${activeClass}`;
};

const getCellClassName = (cell, entityToGet, displayedTable, expanded) => {
  if (cell.column.id === 'name') return 'name-cell';
  const expandedId = getCellId(cell, entityToGet, displayedTable).join('-');
  if (expandedId === expanded.join('-')) return 'active data-cell';
  return 'data-cell';
};

function TableBody({ table }) {
  const { id, entity, entityToGet, expanded, displayedTable, resetExpandler } =
    useAotfContext();

  const isAssociations = displayedTable === 'associations';

  const rowNameEntity = entity === 'target' ? 'name' : 'approvedSymbol';

  const highLevelHeaders = table.getHeaderGroups()[0].headers;

  const handleClickAway = () => {
    resetExpandler();
  };

  return (
    <div>
      <div className="TBody">
        <div className="TRow">
          {table.getRowModel().rows.map(row => (
              <Fragment key={row.id}>
                <div className={getRowClassName(row)}>
                  <div className="data-row-content">
                    {highLevelHeaders.map(columnGroup => (
                        <div
                          className={getColContainerClassName(columnGroup)}
                          key={columnGroup.id}
                        >
                          {columnGroup.subHeaders.map(column => {
                            const cell = row
                              .getVisibleCells()
                              .find(el => el.column.id === column.id);
                            return (
                              <div
                                key={cell.id}
                                className={getCellClassName(
                                  cell,
                                  entityToGet,
                                  displayedTable,
                                  expanded
                                )}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                  </div>
                </div>
                {row.getIsExpanded() && (
                  <div key={`${row.original[entityToGet].id}-${expanded[0]}`}>
                    <ClickAwayListener onClickAway={handleClickAway}>
                      <div>
                        <SecctionRendererWrapper
                          activeSection={expanded}
                          table={displayedTable}
                        >
                          {isAssociations ? (
                            <EvidenceSecctionRenderer
                              id={id}
                              rowId={row.original[entityToGet].id}
                              entity={entity}
                              label={row.original[entityToGet][rowNameEntity]}
                            />
                          ) : (
                            <TargetSecctionRenderer
                              id={id}
                              rowId={row.original[entityToGet].id}
                              entity={entity}
                              label={row.original[entityToGet][rowNameEntity]}
                            />
                          )}
                        </SecctionRendererWrapper>
                      </div>
                    </ClickAwayListener>
                  </div>
                )}
              </Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}

export default TableBody;
