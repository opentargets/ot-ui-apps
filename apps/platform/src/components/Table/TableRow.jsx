import classNames from 'classnames';
import { Hidden, TableCell, TableRow as MUITableRow } from '@material-ui/core';
import _ from 'lodash';
import { v1 } from 'uuid';

import { getHiddenBreakpoints } from './utils';
import { tableStyles } from './tableStyles';

function TableRow({
  columns,
  hover,
  isFixedRow,
  noWrap,
  row,
  style,
  onClick,
  selected,
}) {
  const classes = tableStyles();

  function getTableAlignment({ column }) {
    if (column.align) return column.align;
    if (column.numeric) return 'right';
    return 'left';
  }

  return (
    <MUITableRow
      classes={{ root: isFixedRow ? classes.rowFixed : '' }}
      hover={hover}
      onClick={onClick}
      selected={selected}
    >
      {columns.map(column => (
        // TODO: review props spreading
        // eslint-disable-next-line
        <Hidden {...getHiddenBreakpoints(column)} key={v1()}>
          <TableCell
            align={getTableAlignment({ column })}
            classes={{
              root: classNames(
                classes.cell,
                classes.cellBody,
                column.classes?.cell,
                {
                  [classes.tabularNums]: column.numeric,
                  [classes.cellSticky]: column.sticky,
                  [classes.noWrap]: noWrap,
                }
              ),
            }}
            component={column.sticky ? 'th' : 'td'}
            style={{ ...column.style, ...row.rowStyle, ...style }}
          >
            {column.renderCell
              ? column.renderCell(row)
              : _.get(row, column.propertyPath || column.id, 'N/A')}
          </TableCell>
        </Hidden>
      ))}
    </MUITableRow>
  );
}

export default TableRow;
