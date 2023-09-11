import { useEffect } from 'react';
import { Alert, TablePagination, Typography } from '@mui/material';
import useAotfContext from '../hooks/useAotfContext';
import ColoredCell from './ColoredCell';
import { getLegend } from '../utils';

function TableFooter({ table }) {
  const {
    count,
    loading,
    pagination,
    modifiedSourcesDataControls,
    displayedTable,
    resetDatasourceControls,
  } = useAotfContext();
  const isAssociations = displayedTable === 'associations';

  /**
   * LEGEND EFECT
   */
  useEffect(() => {
    const Legend = getLegend(displayedTable === 'associations');
    document.getElementById('legend').innerHTML = '';
    document.getElementById('legend').appendChild(Legend);
  }, [displayedTable]);

  return (
    <div className="table-footer">
      <div style={{ display: 'flex', alignItems: ' flex-start' }}>
        <div id="legend" />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: '10px',
          }}
        >
          <span
            style={{
              fontWeight: 'bold',
              fontSize: '10px',
              marginBottom: '3px',
            }}
          >
            No data
          </span>
          <ColoredCell />
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        {modifiedSourcesDataControls && isAssociations && (
          <Alert severity="info">
            <Typography variant="caption">
              Datasource controls modified
            </Typography>{' '}
            <button
              onClick={() => resetDatasourceControls()}
              style={{ fontSize: '0.75rem' }}
              type="button"
            >
              Reset to default
            </button>
          </Alert>
        )}
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 200, 500]}
          component="div"
          count={count}
          rowsPerPage={table.getState().pagination.pageSize}
          page={pagination.pageIndex}
          labelRowsPerPage="Associations per page"
          onPageChange={(e, index) => {
            if (!loading) {
              table.setPageIndex(index);
            }
          }}
          onRowsPerPageChange={e => {
            if (!loading) {
              table.setPageSize(Number(e.target.value));
            }
          }}
        />
      </div>
    </div>
  );
}

export default TableFooter;
