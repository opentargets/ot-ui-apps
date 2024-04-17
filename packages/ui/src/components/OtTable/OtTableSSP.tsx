import { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Input,
  InputAdornment,
  Typography,
  CircularProgress,
  NativeSelect,
  IconButton,
} from "@mui/material";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  PaginationState,
  ColumnDef,
} from "@tanstack/react-table";
import {
  faAngleRight,
  faAnglesLeft,
  faMagnifyingGlass,
  faArrowUp,
  faArrowDown,
  faAngleLeft,
} from "@fortawesome/free-solid-svg-icons";

import { makeStyles } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useDebounce from "../../hooks/useDebounce";
import OtTableSearch from "./OtTableSearch";

const useStyles = makeStyles(theme => ({
  OtTableContainer: {
    // backgroundColor: "white",
  },
  tableContainer: {
    width: "100%",
    overflowX: "auto",
    marginTop: "2rem",
  },
  table: {
    whiteSpace: "nowrap",
    borderCollapse: "collapse",
    minWidth: "100%",
    "& thead": {
      "& tr": {
        "&:hover": {
          backgroundColor: "transparent",
        },
        "&:first-child:not(:last-child)": {
          "& th:not(:last-child)": {
            borderRight: `1px solid ${theme.palette.grey[300]}`,
          },
        },
      },
    },
    "& tr": {
      borderBottom: `1px solid ${theme.palette.grey[300]}`,
      "&:hover": {
        backgroundColor: "#f6f6f6",
      },
      "& td": {
        padding: "0.25rem 0.5rem",
      },
      "& th": {
        padding: "1rem 0.5rem",
      },
    },
  },
  tableControls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 1rem",
  },
  rowsControls: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },
  tableColumnHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    "& .sortableColumn": {
      visibility: "hidden",
      padding: "0 0.4rem",
    },
    "&:hover .sortableColumn": {
      visibility: "visible",
      opacity: "0.5",
    },
  },
  stickyColumn: {
    left: "0",
    position: "sticky",
    backgroundColor: theme.palette.grey[100],
    zIndex: 1,
  },
  verticalHeaders: {
    writingMode: "vertical-rl",
    transform: "rotate(180deg)",
    // TODO: TBC
    maxHeight: "20rem",
    height: "14rem",
  },
  cursorPointer: {
    cursor: "pointer",
  },
  cursorAuto: {
    cursor: "auto",
  },
  sortIcon: {
    padding: "0 0.4rem",
  },
}));

const INIT_PAGE_SIZE = 10;

type OtTableProps = {
  showGlobalFilter: boolean;
  verticalHeaders: boolean;
  entity: string;
  sectionName: string;
  columns: ColumnDef<unknown, any>[];
  query: unknown;
  variables: unknown;
  client: unknown;
};

type tableDataObject = {
  count: number;
  loading: boolean;
  initialLoading: boolean;
  dataRows: Array<unknown>;
  cursor: null | string;
  size: number;
};

type AssignDataValuesProps = {
  res: {
    data: unknown;
  };
  removePreviousData?: boolean;
};

function OtTableSSP({
  showGlobalFilter = true,
  verticalHeaders = false,
  columns = [],
  entity = "",
  query = "",
  sectionName = "",
  variables,
  client,
}: OtTableProps) {
  const classes = useStyles();

  const tableDataObjectInitialValue: tableDataObject = {
    count: 0,
    loading: true,
    initialLoading: true,
    dataRows: [],
    cursor: null,
    size: INIT_PAGE_SIZE,
  };

  const [freeTextQuery, setFreeTextQuery] = useState("");
  const [tableObjectState, setTableObjectState] = useState(tableDataObjectInitialValue);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  function getData() {
    return client.query({
      query,
      variables: {
        ...variables,
        cursor: tableObjectState.cursor,
        size: pageSize,
        freeTextQuery,
      },
      fetchPolicy: "no-cache",
    });
  }

  function assignDataValues({ res, removePreviousData }: AssignDataValuesProps) {
    const { data } = res;
    const { cursor, count, rows } = data[entity][sectionName];

    let ALL_ROWS = [];
    if (removePreviousData) ALL_ROWS = [...rows];
    else ALL_ROWS = [...tableObjectState.dataRows, ...rows];

    const newTableState: tableDataObject = {
      count,
      cursor,
      dataRows: ALL_ROWS,
      loading: false,
      initialLoading: false,
      size: pageSize,
    };
    setTableObjectState(newTableState);
  }

  function onPaginationChange(updater) {
    const newState = updater(pagination);
    const newIndex = newState.pageIndex;
    const newPageSize = newState.pageSize;
    const dataLength = table.options.data.length;

    const isPageSizeIncrease = newPageSize > pageSize;
    const nextPageRequested = newIndex > pageIndex;
    const requiresMoreData =
      dataLength < tableObjectState.count && dataLength <= (newIndex + 1) * newPageSize;

    if (isPageSizeIncrease) {
      setTableObjectState({ ...tableObjectState, cursor: null, loading: true });
      getData().then(res => {
        assignDataValues({ res, removePreviousData: true });
        setPagination(newState);
      });
    } else if (nextPageRequested && requiresMoreData) {
      setTableObjectState({ ...tableObjectState, loading: true });
      getData().then(res => {
        assignDataValues({ res, removePreviousData: false });
        setPagination(newState);
      });
    } else setPagination(newState);
  }

  function getPageCount() {
    return Math.ceil(tableObjectState.count / pageSize) || 0;
  }

  function getCurrentPagePosition() {
    // example return 31-40 of 45 || 41-45 of 45
    const pageEndResultSize =
      pageIndex * pageSize + pageSize <= tableObjectState.count
        ? pageIndex * pageSize + pageSize
        : tableObjectState.count;
    return `${pageIndex * pageSize + 1} - ${pageEndResultSize} of ${tableObjectState.count}`;
  }

  function setGlobalSearchTerm(searchQuery: string) {
    const newTableState: tableDataObject = {
      ...tableObjectState,
      cursor: null,
      loading: true,
    };
    setTableObjectState(newTableState);
    setFreeTextQuery(searchQuery);
  }

  function getGlobalSearchData() {
    getData().then(res => {
      assignDataValues({ res, removePreviousData: true });
      setPagination({ pageIndex: 0, pageSize });
    });
  }

  const table = useReactTable({
    data: tableObjectState.dataRows,
    columns,
    pageCount: getPageCount(),
    state: {
      pagination,
    },
    autoResetPageIndex: false,
    onPaginationChange: onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    getGlobalSearchData();
  }, [freeTextQuery]);

  return (
    <div className={classes.OtTableContainer}>
      {/* Global Search */}
      {showGlobalFilter && (
        <Grid container>
          <Grid item xs={12} lg={4}>
            <OtTableSearch setGlobalSearchTerm={setGlobalSearchTerm} />
          </Grid>
        </Grid>
      )}
      {/* Table component */}
      <div className={classes.tableContainer}>
        <table className={classes.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={header.column.columnDef.sticky ? classes.stickyColumn : ""}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          <div className={`${classes.tableColumnHeader}`}>
                            <Typography
                              className={`${
                                verticalHeaders || header.column.columnDef.verticalHeader
                                  ? classes.verticalHeaders
                                  : ""
                              }`}
                              onClick={header.column.getToggleSortingHandler()}
                              variant="subtitle2"
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}

                              {/*
                               * sorting icon
                               */}
                              {/* {!header.column.getIsSorted() && header.column.getCanSort() && (
                                <FontAwesomeIcon
                                  size="sm"
                                  icon={faArrowUp}
                                  className="sortableColumn"
                                />
                              )} */}
                              {/* {{
                                asc: (
                                  <FontAwesomeIcon
                                    size="sm"
                                    icon={faArrowUp}
                                    className={classes.sortIcon}
                                  />
                                ),

                                desc: (
                                  <FontAwesomeIcon
                                    size="sm"
                                    icon={faArrowDown}
                                    className={classes.sortIcon}
                                  />
                                ),
                              }[header.column.getIsSorted() as string] ?? null} */}
                            </Typography>
                            {/* {header.column.getCanFilter() ? (
                              <OtTableColumnFilter column={header.column} />
                            ) : null} */}
                          </div>
                        </>
                      )}
                    </th>
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
                      <td
                        key={cell.id}
                        className={cell.column.columnDef.sticky ? classes.stickyColumn : ""}
                      >
                        <Typography variant="body2">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Typography>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={classes.tableControls}>
        <div className="rowsPerPage">
          <span>Rows per page:</span>
          <NativeSelect
            disabled={tableObjectState.loading}
            disableUnderline
            sx={{ pl: theme => theme.spacing(2) }}
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value));
              setPagination({
                pageIndex: 0,
                pageSize: Number(e.target.value),
              });
            }}
          >
            {[10, 25, 100].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </NativeSelect>
        </div>

        <div className={classes.rowsControls}>
          {tableObjectState.loading && <CircularProgress size={20} />}
          <div className="pageInfo">
            <span>{getCurrentPagePosition()}</span>
          </div>

          <div className="paginationAction">
            <IconButton
              color="primary"
              onClick={() => {
                table.setPageIndex(0);
              }}
              disabled={tableObjectState.loading || !table.getCanPreviousPage()}
            >
              <FontAwesomeIcon size="2xs" icon={faAnglesLeft} />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => table.previousPage()}
              disabled={tableObjectState.loading || !table.getCanPreviousPage()}
            >
              <FontAwesomeIcon size="2xs" icon={faAngleLeft} />
            </IconButton>

            <IconButton
              color="primary"
              onClick={() => {
                table.nextPage();
              }}
              disabled={tableObjectState.loading || !table.getCanNextPage()}
            >
              <FontAwesomeIcon size="2xs" icon={faAngleRight} />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtTableSSP;
