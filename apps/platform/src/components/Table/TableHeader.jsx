import classNames from 'classnames';
import _ from 'lodash';
import {
  Hidden,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  withWidth,
} from '@material-ui/core';
import { v1 } from 'uuid';

import { getHiddenBreakpoints } from './utils';
import { tableStyles } from './tableStyles';
import Tooltip from '../Tooltip';
import useDynamicColspan from '../../hooks/useDynamicColspans';

function HeaderCell({
  classes = {},
  align,
  colspan,
  isHeaderGroup = false,
  label,
  labelStyle,
  minWidth,
  noWrapHeader,
  sortable = false,
  sortParams,
  sticky = false,
  tooltip,
  tooltipStyle = {},
  width,
}) {
  const headerClasses = tableStyles();

  const style = {
    minWidth,
    width,
    ...labelStyle,
  };

  const labelInnerComponent = (
    <span className={classNames(classes.innerLabel, headerClasses.headerSpan)}>
      {tooltip ? (
        <Tooltip style={tooltipStyle} showHelpIcon title={tooltip}>
          <span className={headerClasses.headerLabelWithTooltip}>{label}</span>
        </Tooltip>
      ) : (
        label
      )}
    </span>
  );

  return (
    <TableCell
      align={align}
      classes={{
        root: classNames(
          headerClasses.cell,
          headerClasses.cellHeader,
          classes.headerCell,
          {
            [headerClasses.cellGroup]: isHeaderGroup,
            [headerClasses.cellSticky]: sticky,
            [headerClasses.noWrap]: noWrapHeader,
          }
        ),
      }}
      colSpan={colspan}
      sortDirection={sortable && sortParams.direction}
      style={style}
    >
      {sortable ? (
        // TODO: review props spreading
        // eslint-disable-next-line
        <TableSortLabel className={classes.sortLabel} {...sortParams}>
          {labelInnerComponent}
        </TableSortLabel>
      ) : (
        labelInnerComponent
      )}
    </TableCell>
  );
}

function TableHeader({
  columns,
  headerGroups,
  noWrapHeader,
  order,
  onRequestSort,
  sortBy,
  width,
}) {
  const colspans = useDynamicColspan(headerGroups, columns, width);
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  function getTableAlignment({ column }) {
    if (column.align) return column.align;
    if (column.numeric) return 'right';
    return 'left';
  }

  return (
    <TableHead>
      {headerGroups.length > 0 ? (
        <TableRow>
          {headerGroups.map((headerCell, cellIndex) => (
            <HeaderCell
              colspan={colspans[cellIndex]}
              isHeaderGroup
              key={v1()}
              label={headerCell.label || ''}
              noWrapHeader={noWrapHeader}
              sticky={headerCell.sticky || false}
              tooltip={headerCell.tooltip}
              tooltipStyle={headerCell.tooltipStyle || {}}
            />
          ))}
        </TableRow>
      ) : null}
      <TableRow>
        {columns.map(column => (
          // TODO: review props spreading
          // eslint-disable-next-line
          <Hidden {...getHiddenBreakpoints(column)} key={v1()}>
            <HeaderCell
              align={getTableAlignment({ column })}
              label={column.label || _.startCase(column.id)}
              noWrapHeader={noWrapHeader}
              sortable={column.sortable}
              sortParams={
                column.sortable
                  ? {
                      active: sortBy === column.id,
                      direction: sortBy === column.id ? order : 'asc',
                      onClick: createSortHandler(column.id),
                    }
                  : null
              }
              labelStyle={column.labelStyle}
              classes={column.classes}
              sticky={column.sticky}
              tooltip={column.tooltip}
              tooltipStyle={column.tooltipStyle}
              width={column.width}
              minWidth={column.minWidth}
            />
          </Hidden>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default withWidth()(TableHeader);
