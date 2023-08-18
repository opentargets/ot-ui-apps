import { Fragment } from 'react';
import { flexRender } from '@tanstack/react-table';
import { ClickAwayListener, Fade, Grow } from '@material-ui/core';

import useAotfContext from '../hooks/useAotfContext';

import { getCellId } from '../utils';
import {
  RowContainer,
  RowsContainer,
  TableBodyContent,
  GridContainer,
} from '../layout';

import { SectionRender, SectionRendererWrapper } from './SectionRender';

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

function TableBody({ core, expanded, cols }) {
  const { id, entity, entityToGet, displayedTable, resetExpandler } =
    useAotfContext();

  const { rows } = core.getRowModel();
  if (rows.length < 1) return null;

  const rowNameEntity = entity === 'target' ? 'name' : 'approvedSymbol';
  const highLevelHeaders = core.getHeaderGroups()[0].headers;
  const tablePrefix = core.getState().prefix;
  const isExpandedInTable = expanded[3] === tablePrefix;

  const handleClickAway = () => {
    resetExpandler();
  };

  return (
    <TableBodyContent>
      <RowsContainer>
        {rows.map(row => (
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
              <div>
                <ClickAwayListener onClickAway={handleClickAway}>
                  <Grow in timeout={600}>
                    <section>
                      <SectionRendererWrapper>
                        <SectionRender
                          id={id}
                          entity={entity}
                          section={expanded[2]}
                          expanded={expanded}
                          rowId={row.original[entityToGet].id}
                          row={row}
                          entityToGet={entityToGet}
                          rowNameEntity={rowNameEntity}
                          displayedTable={displayedTable}
                          cols={cols}
                        />
                      </SectionRendererWrapper>
                    </section>
                  </Grow>
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
