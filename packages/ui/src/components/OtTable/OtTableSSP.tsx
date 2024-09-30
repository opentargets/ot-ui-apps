import { ReactElement, useEffect, useMemo, useReducer, useState } from "react";
import { Box, CircularProgress, Grid, IconButton, NativeSelect } from "@mui/material";
import {
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  PaginationState,
} from "@tanstack/react-table";
import { faAngleLeft, faAngleRight, faBackwardStep } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import { naLabel } from "../../constants";
import OtTableSearch from "./OtTableSearch";
import { OtTableSSPProps } from "./types/tableTypes";
import { OtTableContainer, OtTableHeader, OtTH, OtTableHeaderText, OtTD } from "./otTableLayout";
import DataDownloader from "../DataDownloader";
import {
  getCurrentPagePosition,
  getDefaultSortObj,
  getFilterValueFromObject,
  mapTableColumnToTanstackColumns,
} from "./utils/tableUtils";
import Tooltip from "../Tooltip";

import useDebounce from "../../hooks/useDebounce";
import { getTableRows } from "./service/tableService";
import { createInitialState, otTableReducer } from "./context/otTableReducer";
import { addRows, setLoading } from "./context/otTableActions";
import { naLabel } from "../../constants";

function OtTableSSP({
  showGlobalFilter = true,
  columns = [],
  verticalHeaders = false,
  query,
  variables,
  entity,
  sectionName,
}: OtTableSSPProps): ReactElement {
  const [globalFilter, setGlobalFilter] = useState("");
  const [state, dispatch] = useReducer(otTableReducer, "", createInitialState);

  const table = useReactTable({
    data: state.rows,
    columns,
    rowCount: state.count,
    autoResetPageIndex: false,
    // manualPagination: true,
    onPaginationChange: onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Manage your own state
  const [customState, setCustomState] = useState(table.initialState);

  // Override the state managers for the table to your own
  // table.setOptions(prev => ({
  //   ...prev,
  //   state: customState,
  //   onStateChange: setCustomState,
  //   // These are just table options, so if things
  //   // need to change based on your state, you can
  //   // derive them here

  //   // Just for fun, let's debug everything if the pageIndex
  //   // is greater than 2
  // }));

  function onPaginationChange(updater) {
    const { pagination } = table.options.state;
    const newPagination = updater(pagination);
    console.log(pagination);
    console.log(newPagination);
    // table.setPageIndex(newPagination.pageIndex);
    console.log(table.options.state);
    return newPagination;
  }

  function onPageChange(newIndex: string) {
    console.log("onPageChange new index", newIndex);
    // let newDataRequired = false;
    // if(state.index > newIndex) {
    //   newDataRequired = true;
    // }
    // if(!newDataRequired) return table.setPageIndex(Number(newIndex));

    // dispatch(setLoading(true));
    // dispatch(onPageSizeChange());
    // getTableRows(query, variables, state.cursor, state.size, state.freeTextQuery).then(d => {
    //   console.log(d);
    //   // d.data[entity][sectionName];
    //   // dispatch(setdata);
    // });
    // return table.setPageIndex(Number(newIndex));
  }

  function onPageSizeChange(newSize: string) {
    console.log("onPageChange new size", newSize);

    // dispatch(setLoading(true));
    // dispatch(onPageSizeChange());
    // getTableRows(query, variables, state.cursor, state.size, state.freeTextQuery).then(d => {
    //   console.log(d);
    //   // d.data[entity][sectionName];
    //   // dispatch(setdata);
    // });
    // table.setPageSize(Number(newSize));
  }

  useEffect(() => {
    getTableRows(
      query,
      variables,
      state.cursor,
      table.options.state.pagination?.pageSize,
      state.freeTextQuery
    ).then(d => {
      console.log(d.data[entity][sectionName]);
      // d.data[entity][sectionName];
      dispatch(addRows(d.data[entity][sectionName]));
    });
    // update with debounce
  }, [globalFilter]);

  return (
    <div>
      {/* Global Search */}
      <Grid container>
        {showGlobalFilter && (
          <Grid item sm={12} md={4}>
            <OtTableSearch setGlobalSearchTerm={setGlobalFilter} />
          </Grid>
        )}
        {/* {dataDownloader && (
          <Grid item sm={12} md={8} sx={{ ml: "auto" }}>
            <DataDownloader
              columns={dataDownloaderColumns || columns}
              rows={rows}
              fileStem={dataDownloaderFileStem}
              query={query}
              variables={variables}
            />
          </Grid>
        )} */}
      </Grid>
      {/* Table component container */}
      <Box sx={{ w: 1, overflowX: "auto", marginTop: theme => theme.spacing(3) }}>
        {/* Table component */}
        <OtTableContainer>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <OtTH
                      key={header.id}
                      colSpan={header.colSpan}
                      stickyColumn={header.column.columnDef.sticky}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          <OtTableHeader>
                            <OtTableHeaderText
                              verticalHeader={
                                header.column.columnDef.verticalHeader || verticalHeaders
                              }
                              onClick={header.column.getToggleSortingHandler()}
                              sx={{ typography: "subtitle2" }}
                            >
                              <Tooltip
                                style={""}
                                title={header.column.columnDef.tooltip}
                                showHelpIcon={!!header.column.columnDef.tooltip}
                              >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </Tooltip>
                            </OtTableHeaderText>
                          </OtTableHeader>
                        </>
                      )}
                    </OtTH>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <OtTD key={cell.id} stickyColumn={cell.column.columnDef.sticky}>
                        <Box sx={{ typography: "body2" }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          {/* TODO: check NA value */}
                          {/* {Boolean(flexRender(cell.column.columnDef.cell, cell.getContext())) ||
                            naLabel} */}
                        </Box>
                      </OtTD>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </OtTableContainer>
      </Box>

      {/* Table footer component container */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          padding: theme => `${theme.spacing(2)} 0 `,
        }}
      >
        {state.loading && <CircularProgress sx={{ mx: theme => theme.spacing(2) }} size={25} />}
        <div>
          <span>Rows per page:</span>
          <NativeSelect
            disableUnderline
            sx={{ pl: theme => theme.spacing(2) }}
            value={table.getState().pagination.pageSize}
            onChange={e => {
              // onPageSizeChange(e.target.value);
              table.setPageSize(Number(e.target.value));
            }}
          >
            {/* TODO: set page size  */}
            {[10, 25, 100].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </NativeSelect>
        </div>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: theme => theme.spacing(3),
            marginLeft: theme => theme.spacing(3),
          }}
        >
          <div>
            {/* TODO: get correct page position */}
            <span>
              {/* TODO: check if  page position multiply by page size  */}
              {/*  <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
               */}
              {getCurrentPagePosition(
                table.getState().pagination.pageIndex,
                table.getState().pagination.pageSize,
                table.getGroupedRowModel().rows.length
              )}
            </span>
          </div>

          <div className="paginationAction">
            {/* TODO: disable button while loading */}
            <IconButton
              onClick={() => table.setPageIndex(0)}
              // disabled={!table.getCanPreviousPage()}
            >
              <FontAwesomeIcon size="2xs" icon={faBackwardStep} />
            </IconButton>
            <IconButton onClick={() => table.previousPage()}>
              <FontAwesomeIcon size="2xs" icon={faAngleLeft} />
            </IconButton>

            <IconButton onClick={() => table.nextPage()}>
              <FontAwesomeIcon size="2xs" icon={faAngleRight} />
            </IconButton>
          </div>
        </Box>
      </Box>
    </div>
  );
}

export default OtTableSSP;
