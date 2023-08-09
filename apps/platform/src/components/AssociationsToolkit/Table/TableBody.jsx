import { Fragment } from 'react';
import { flexRender } from '@tanstack/react-table';
import { ClickAwayListener, Fade, Grow } from '@material-ui/core';
import { v1 } from 'uuid';
import {
  EvidenceSecctionRenderer,
  SecctionRendererWrapper,
  TargetSecctionRenderer,
} from './SectionRender';
import useAotfContext from '../hooks/useAotfContext';

import { getCellId } from '../utils';
import {
  RowContainer,
  RowsContainer,
  TableBodyContent,
  GridContainer,
} from '../layout';

/* HELPERS */
const getColContainerClassName = ({ id }) => {
  if (id === '1_naiming-cols_name') return 'group-naiming-cols';
  return 'group-entity-cols';
};

const getRowActive = ({ getIsExpanded }, isExpandedInTable) =>
  getIsExpanded() && isExpandedInTable;

const getCellClassName = (
  cell,
  entityToGet,
  displayedTable,
  expanded,
  tablePrefix
) => {
  if (cell.column.id === 'name') return 'name-cell';
  const expandedId = getCellId(
    cell,
    entityToGet,
    displayedTable,
    tablePrefix
  ).join('-');
  if (expandedId === expanded.join('-')) return 'active data-cell';
  return 'data-cell';
};

function TableBody({ table, expanded, prefix = null, cols }) {
  const { id, entity, entityToGet, displayedTable, resetExpandler } =
    useAotfContext();

  const isAssociations = displayedTable === 'associations';

  const rowNameEntity = entity === 'target' ? 'name' : 'approvedSymbol';

  const highLevelHeaders = table.getHeaderGroups()[0].headers;

  const handleClickAway = () => {
    resetExpandler();
  };

  const tablePrefix = table.getState().prefix;
  const isExpandedInTable = expanded[3] === tablePrefix;

  return (
    <TableBodyContent>
      <RowsContainer>
        {table.getRowModel().rows.map(row => (
          <Fragment key={row.id}>
            <Fade in>
              <RowContainer rowExpanded={getRowActive(row, isExpandedInTable)}>
                {highLevelHeaders.map(columnGroup => (
                  <GridContainer
                    columnsCount={cols.length}
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
                            expanded,
                            tablePrefix
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      );
                    })}
                  </GridContainer>
                ))}
              </RowContainer>
            </Fade>
            {isExpandedInTable && row.getIsExpanded() && (
              <div key={v1()}>
                <ClickAwayListener onClickAway={handleClickAway}>
                  <div>
                    <Grow in>
                      <SecctionRendererWrapper
                        activeSection={expanded}
                        table={displayedTable}
                        tablePrefix={prefix}
                      >
                        {isAssociations ? (
                          <EvidenceSecctionRenderer
                            id={id}
                            row={row}
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
                    </Grow>
                  </div>
                </ClickAwayListener>
              </div>
            )}
          </Fragment>
        ))}
      </RowsContainer>
    </TableBodyContent>
  );
}

export default TableBody;
