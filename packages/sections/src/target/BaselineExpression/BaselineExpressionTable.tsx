import { faAsterisk, faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { naLabel } from "@ot/constants";
import { type RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import {
  createColumnHelper,
  type ExpandedState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import type React from "react";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Tooltip } from "ui";
import DetailPlot from "./DetailPlot";

// Declare module for TanStack Table
declare module "@tanstack/table-core" {
  interface FilterFns {
    searchFilterFn: FilterFn<unknown>;
  }

  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

function getSortingFn(datatype, allDatatypes) {
  return (rowA, rowB) => {
    const a = rowA.original;
    const b = rowB.original;
    const otherDatatypes = new Set(allDatatypes);
    otherDatatypes.delete(datatype);
    const orderedDatatypes = [datatype, ...otherDatatypes];
    for (const dt of orderedDatatypes) {
      let aMedian = a[dt]?.median;
      let bMedian = b[dt]?.median;
      if (aMedian === undefined && bMedian === undefined) continue;
      if (aMedian === null) aMedian = -1;
      else if (aMedian === undefined) aMedian = -2;
      if (bMedian === null) bMedian = -1;
      else if (bMedian === undefined) bMedian = -2;
      return aMedian - bMedian;
    }
    return 0;
  };
}

// Search filter function
const searchFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  const allRowValuesInString = JSON.stringify(row.original);
  const containsSubstr = new RegExp(value, "i").test(allRowValuesInString);

  addMeta({
    itemRank,
  });

  return itemRank.passed || containsSubstr;
};

interface BaselineExpressionDataRow {
  targetFromSourceId: string;
  tissueBiosample?: {
    biosampleId: string;
    biosampleName: string;
  };
  tissueBiosampleParent?: {
    biosampleId: string;
    biosampleName: string;
  };
  celltypeBiosample?: {
    biosampleId: string;
    biosampleName: string;
  };
  celltypeBiosampleParent?: {
    biosampleId: string;
    biosampleName: string;
  };
  median: number;
  datasourceId: string;
  datatypeId: string;
}

type BaselineExpressionTableRow = {
  [K in (typeof datatypes)[number]]: BaselineExpressionDataRow;
};

interface BaselineExpressionTableProps {
  processedData: any;
  datatypes: string[];
  DownloaderComponent?: React.ReactNode;
  specificityThreshold: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  tableContainer: {
    marginTop: theme.spacing(1),
  },
  mainTable: {
    tableLayout: "fixed",
    width: "100%",
  },
  headerCell: {
    fontWeight: "bold",
    padding: "0px 8px",
    fontSize: "0.75rem",
  },
  tissueCell: {
    fontWeight: "bold",
    fontSize: "0.75rem",
  },
  medianCell: {
    textAlign: "center",
    fontSize: "0.75rem",
    marginRight: "8px",
  },
  barContainer: {
    height: "12px",
    backgroundColor: theme.palette.grey[200],
    // borderRadius: "2px",
    position: "relative",
    margin: "2px 0px",
    // padding: "0px 4px",
  },
  failed: {
    backgroundColor: theme.palette.grey[100],
    fontSize: "8.5px",
  },
  bar: {
    height: "100%",
    // backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.dark,
    // borderRadius: "2px",
    transition: "width 0.3s ease",
  },
  childBar: {
    height: "100%",
    // backgroundColor: "#BFDAEE",
    backgroundColor: theme.palette.primary.main,
    // borderRadius: "2px",
    transition: "width 0.3s ease",
  },
  groupRow: {
    cursor: "pointer",
    "& td": {
      // padding: "0px 8px",
    },
  },
  nestedRow: {
    cursor: "pointer",
    // backgroundColor: theme.palette.grey[50]
    "& td": {
      // padding: "0px 8px",
    },
  },
  cursorAuto: {
    cursor: "auto !important",
  },
  nestedTable: {
    width: "100%",
  },
  nestedTableCell: {
    borderBottom: "none",
    padding: "0px 8px",
    fontSize: "0.75rem",
  },
  expandButton: {
    padding: "2px",
    minWidth: "24px",
    height: "24px",
  },
  expandColumn: {
    width: "24px",
  },
}));

const columnHelper = createColumnHelper<BaselineExpressionTableRow>();

const BaselineExpressionTable: React.FC<BaselineExpressionTableProps> = ({
  data,
  datatypes,
  DownloaderComponent,
  specificityThreshold,
}) => {
  const classes = useStyles();
  const [sorting, setSorting] = useState<SortingState>([{ id: datatypes[0], desc: true }]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [groupByTissue, setGroupByTissue] = useState(true);
  // const [searchTerm, setSearchTerm] = useState("");

  // Custom handler to ensure only one second-level row is expanded at a time
  const handleExpandedChange = useCallback(
    (updaterOrValue: ExpandedState | ((old: ExpandedState) => ExpandedState)) => {
      setExpanded((old) => {
        const newExpanded =
          typeof updaterOrValue === "function" ? updaterOrValue(old) : updaterOrValue;

        // Find all second-level row IDs (they contain a dot, e.g., "0.1", "2.3")
        const secondLevelRows = Object.keys(newExpanded).filter(
          (id) => id.includes(".") && newExpanded[id] === true
        );

        // If more than one second-level row is expanded, keep only the most recently expanded one
        if (secondLevelRows.length > 1) {
          const result = { ...newExpanded };
          // Find which row was just expanded by comparing with old state
          const newlyExpanded = secondLevelRows.find((id) => !old[id]);

          if (newlyExpanded) {
            // Close all other second-level rows except the newly expanded one
            secondLevelRows.forEach((id) => {
              if (id !== newlyExpanded) {
                result[id] = false;
              }
            });
          }
          return result;
        }

        return newExpanded;
      });
    },
    []
  );

  const viewType = groupByTissue ? "tissue" : "celltype";
  const { firstLevel, secondLevel, thirdLevel } = data[viewType];

  // Handler to collapse all expanded rows
  const handleCollapseAll = useCallback(() => {
    setExpanded({});
  }, []);

  const getRowCanExpand = useCallback(
    (row) => {
      return row.original._firstLevelId || thirdLevel[row.original._secondLevelId];
    },
    [firstLevel, secondLevel, thirdLevel]
  );

  const getSubRows = useCallback(
    (row) => {
      return secondLevel[row._firstLevelId] ?? [];
    },
    [firstLevel, secondLevel]
  );

  const getName = useCallback(
    (obj) => {
      let dataRow;
      for (const datatype of datatypes) {
        dataRow = obj[datatype];
        if (dataRow) break;
      }
      return dataRow._secondLevelName ?? dataRow._firstLevelName;
    },
    [groupByTissue]
  );

  const getColumnWidth = (index) => {
    return index === 0 ? "18%" : index === 1 ? "3%" : `${60 / datatypes.length}%`;
  };

  const columns = [
    columnHelper.accessor((row) => getName(row), {
      id: "name",
      header: groupByTissue ? "Tissue" : "Cell Type",
      cell: (cellContext) => {
        const isFirstLevel = cellContext.row.original._firstLevelId;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              pl: isFirstLevel ? null : 6,
            }}
          >
            {!isFirstLevel && (
              <Box
                sx={{
                  position: "absolute",
                  height: "1px",
                  width: "48px",
                  bgcolor: "#fff",
                  bottom: -1,
                  left: 0,
                }}
              />
            )}
            {isFirstLevel && (
              <IconButton
                size="small"
                className={classes.expandButton}
                sx={{ visibility: cellContext.row.getCanExpand() ? "visible" : "hidden" }} // keeps all rows same height
              >
                {cellContext.row.getIsExpanded() ? (
                  <FontAwesomeIcon icon={faCaretUp} size="xs" />
                ) : (
                  <FontAwesomeIcon icon={faCaretDown} size="xs" />
                )}
              </IconButton>
            )}
            <Typography
              variant="caption"
              sx={{
                fontWeight: isFirstLevel ? "bold" : "normal",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              <Tooltip title={cellContext.getValue()}>{cellContext.getValue()}</Tooltip>
            </Typography>
          </Box>
        );
      },
    }),
    columnHelper.display({
      id: "expand",
      header: "",
      cell: (cellContext) => {
        const isFirstLevel = cellContext.row.original._firstLevelId;
        if (isFirstLevel) return <Box sx={{ width: "24px", height: "24px" }}></Box>;
        return (
          // <Box sx={{ display: "flex", justifyContent: "end" }}>
          // <Box sx={{ width: "24px", height: "24px" }}>
          <IconButton
            size="small"
            className={classes.expandColumn}
            sx={{ visibility: cellContext.row.getCanExpand() ? "visible" : "hidden" }} // keeps all rows same height
          >
            {cellContext.row.getIsExpanded() ? (
              <FontAwesomeIcon icon={faCaretUp} size="xs" />
            ) : (
              <FontAwesomeIcon icon={faCaretDown} size="xs" />
            )}
          </IconButton>
          // </Box>
        );
      },
    }),
  ];

  for (const datatype of datatypes) {
    // empty column
    if (!groupByTissue && datatype === "mass-spectrometry proteomics") {
      columns.push(
        columnHelper.accessor(() => {}, {
          header: "",
          accessorKey: datatype,
          enableSorting: false,
        })
      );
    } else {
      columns.push(
        // use -1 for missing value to make sorting work
        columnHelper.accessor(
          (row) => {
            const value = row[datatype]?._normalisedMedian;
            if (value === null) return -1;
            if (value === undefined) return -2;
            return value;
          },
          {
            header: datatype,
            enableSorting: true,
            sortingFn: getSortingFn(datatype, datatypes),
            cell: (cellContext) => {
              const isFirstLevel = cellContext.row.original._firstLevelId;
              const isSecondLevel = !isFirstLevel && cellContext.row.depth === 1;
              const isExpanded = cellContext.row.getIsExpanded();
              const backgroundColor =
                datatype === datatypes[0] && isSecondLevel && isExpanded ? "grey.200" : null;
              const value = cellContext.getValue();

              if (value === -1) {
                return (
                  <Box className={classes.medianCell}>
                    <Box className={`${classes.barContainer} ${classes.failed}`}>{naLabel}</Box>
                  </Box>
                );
              }

              if (value === -2) return <Box className={classes.medianCell}></Box>;

              const percent = value >= 0 ? value * 100 : 0;
              const specificityValue =
                cellContext.row.original[datatype]?._firstLevelSpecificityScore ??
                cellContext.row.original[datatype]?.specificity_score;

              return (
                <Tooltip
                  title={Object.entries(cellContext.row.original[datatype]).map(
                    ([key, propertyValue]) => (
                      <Box key={key}>
                        <Typography variant="caption" component="span">
                          <strong>{key}</strong>
                        </Typography>
                        :{" "}
                        <Typography variant="caption" component="span">
                          {JSON.stringify(propertyValue)}
                        </Typography>
                      </Box>
                    )
                  )}
                  style=""
                >
                  <Box className={classes.medianCell}>
                    <Box className={classes.barContainer}>
                      <Box
                        className={
                          cellContext.row.original._firstLevelId ? classes.bar : classes.childBar
                        }
                        style={{ width: `${percent}%` }}
                      />
                      {cellContext.row.original[datatype][
                        isFirstLevel ? "_firstLevelSpecificityScore" : "specificity_score"
                      ] >= specificityThreshold && (
                        <Box
                          sx={{
                            position: "absolute",
                            right: -12,
                            top: -1,
                            fontSize: 10,
                            fontWeight: 500,
                            // color: isFirstLevel ? "primary.dark" : "primary.main",
                          }}
                        >
                          <FontAwesomeIcon icon={faAsterisk} />
                        </Box>
                      )}
                      {/* <Typography
                        variant="caption"
                        sx={{
                          position: "absolute",
                          right: 0,
                          top: -13,
                          fontSize: 10,
                          fontWeight: 500,
                        }}
                      >
                        {specificityValue ? specificityValue.toFixed(3) : String(specificityValue)}
                      </Typography> */}
                    </Box>
                  </Box>
                </Tooltip>
              );
            },
          }
        )
      );
    }
  }

  // create table instance
  const table = useReactTable({
    data: firstLevel,
    columns,
    getRowCanExpand,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getSubRows,
    onSortingChange: setSorting,
    onExpandedChange: handleExpandedChange,
    state: {
      sorting,
      pagination,
      expanded,
    },
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    paginateExpandedRows: false, // This prevents child rows from being paginated
    manualPagination: false,
    // filterFns: {
    //   searchFilterFn: searchFilter,
    // },
  });

  useEffect(() => {
    table.setSorting([
      {
        id: firstLevel._maxSpecificity?.datatype ?? datatypes[0],
        desc: true,
      },
    ]);
  }, [table, firstLevel]);

  useEffect(() => {
    setExpanded({});
  }, [groupByTissue]);

  return (
    <Box className={classes.tableContainer}>
      <Box sx={{ display: "flex", gap: 1, width: "100%", mb: 2, justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ToggleButtonGroup
              value={groupByTissue ? "tissue" : "celltype"}
              aria-label="toggle view"
              size="small"
              sx={{ p: 0 }}
              exclusive
              onChange={(event, newValue) => setGroupByTissue(newValue === "tissue")}
            >
              <ToggleButton value="tissue" aria-label="tissue">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box>Tissue → Detail → Cell Type</Box>
                  {data.tissue.firstLevel._maxSpecificity.score >= specificityThreshold ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        justifyContent: "center",
                      }}
                    >
                      <FontAwesomeIcon icon={faAsterisk} size="sm" />
                      <strong>specific expression</strong>
                    </Box>
                  ) : (
                    <Box sx={{ fontWeight: 400, fontStyle: "italic" }}>no specific expression</Box>
                  )}
                </Box>
              </ToggleButton>
              <ToggleButton value="celltype" aria-label="cell type">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box>Cell Type → Detail → Tissue</Box>
                  {data.celltype.firstLevel._maxSpecificity.score >= specificityThreshold ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        justifyContent: "center",
                      }}
                    >
                      <FontAwesomeIcon icon={faAsterisk} size="sm" />
                      <strong>specific expression</strong>
                    </Box>
                  ) : (
                    <Box sx={{ fontWeight: 400, fontStyle: "italic" }}>no specific expression</Box>
                  )}
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCollapseAll}
            disabled={Object.keys(expanded).length === 0}
            sx={{
              fontSize: "0.75rem",
              textTransform: "none",
              padding: "2px 12px",
            }}
          >
            Collapse All
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>{DownloaderComponent}</Box>
      </Box>
      <Grid justifyContent="center" container>
        <Grid item xs={12} md={10}>
          <TableContainer component={Paper} elevation={0}>
            <Table size="small" className={classes.mainTable} style={{ fontSize: "0.75rem" }}>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => {
                      return (
                        <TableCell
                          key={header.id}
                          className={classes.headerCell}
                          onClick={header.column.getToggleSortingHandler()}
                          style={{
                            cursor: header.column.getCanSort() ? "pointer" : "default",
                            width: getColumnWidth(index),
                            border: "none",
                          }}
                        >
                          {header.isPlaceholder ? null : (
                            <Box display="flex" alignItems="center">
                              <Typography variant="caption" style={{ fontWeight: "bold" }}>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </Typography>
                              {header.column.getCanSort() && (
                                <TableSortLabel
                                  active={!!header.column.getIsSorted()}
                                  direction={header.column.getIsSorted() === "asc" ? "asc" : "desc"}
                                />
                              )}
                            </Box>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHead>

              <TableBody>
                {table.getRowModel().rows.map((row) => {
                  const isFirstLevel = row.original._firstLevelId;
                  const _isSecondLevel = row.depth === 1;

                  const isExpanded = row.getIsExpanded();

                  // Check if this second-level row is the last child of its parent
                  const isLastChildOfParent =
                    _isSecondLevel &&
                    (() => {
                      const parentRow = table.getRowModel().rows.find((r) => r.id === row.parentId);
                      if (!parentRow) return false;
                      const subRows = parentRow.subRows;
                      return subRows && subRows[subRows.length - 1]?.id === row.id;
                    })();

                  // Show bottom border only if: it's the last child AND NOT expanded
                  // (when expanded, the third-level row will handle the bottom border)
                  const shouldShowBottomBorder =
                    _isSecondLevel && isLastChildOfParent && !isExpanded;

                  return (
                    <Fragment key={row.id}>
                      {/* 1st and 2nd level rows */}
                      <TableRow
                        className={`${isFirstLevel ? classes.groupRow : classes.nestedRow} ${row.getCanExpand() ? "" : classes.cursorAuto}`}
                        onClick={() => {
                          if (row.getCanExpand()) row.toggleExpanded();
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: "grey.200",
                          },
                          ...(row.getCanExpand() && {
                            "&:hover": {
                              backgroundColor: "grey.200",
                              cursor: "pointer",
                            },
                          }),
                          // ...(isFirstLevel &&
                          //   isExpanded &&
                          //   {
                          //     // backgroundColor: "grey.300",
                          //   }),
                          // ...(_isSecondLevel &&
                          //   isExpanded &&
                          //   row.original.datatypeId === datatypes[0] && {
                          //     backgroundColor: "grey.300",
                          //   }),
                        }}
                      >
                        {row.getVisibleCells().map((cell, index) => {
                          const isExpandColumn =
                            _isSecondLevel && isExpanded && cell.column.id === "expand";
                          const isSingleCellColumn =
                            _isSecondLevel && isExpanded && cell.column.id === datatypes[0];
                          const isEitherColumn = isExpandColumn || isSingleCellColumn;
                          return (
                            <TableCell
                              sx={{
                                position: "relative",
                                width: getColumnWidth(index),
                                border: "none",
                                // padding: 0,
                                // mx: 2,
                                pl: 1.5,
                                pr: 1.5,
                                py: 0,
                                backgroundColor: isEitherColumn ? "grey.50" : null,
                                borderStyle: "solid",
                                borderColor: "grey.300",
                                borderTopWidth: 0,
                                borderBottomWidth:
                                  _isSecondLevel && isExpanded && !isEitherColumn ? "1px" : 0,
                                borderLeftWidth: 0,
                                borderRightWidth: 0,
                              }}
                              key={cell.id}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              {isEitherColumn && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    borderStyle: "solid",
                                    borderColor: "grey.300",
                                    borderTopWidth: "1px",
                                    borderBottomWidth: 0,
                                    borderLeftWidth: isExpandColumn ? "1px" : 0,
                                    borderRightWidth: isSingleCellColumn ? "1px" : 0,
                                    borderTopLeftRadius: isExpandColumn ? "3px" : 0,
                                    borderTopRightRadius: isSingleCellColumn ? "3px" : 0,
                                  }}
                                />
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      {/* 3rd level rows */}
                      {row.getIsExpanded() && row.original._secondLevelId && (
                        <TableRow sx={{ "& > *": { marginBottom: 5 } }}>
                          <TableCell
                            colSpan={table.getVisibleLeafColumns().length}
                            sx={{
                              border: "none",
                              p: 0,
                            }}
                            key={row.id}
                          >
                            <Box
                              sx={{
                                width: "100%",
                                height: "100%",
                                // mx: 1,
                                // backgroundColor: "grey.200",
                              }}
                            >
                              <DetailPlot
                                data={thirdLevel[row.original._secondLevelId]}
                                show={groupByTissue ? "celltype" : "tissue"}
                              />
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={table.getFilteredRowModel().rows.length}
            page={pagination.pageIndex}
            onPageChange={(_, newPage) => {
              table.setPageIndex(newPage);
            }}
            rowsPerPage={pagination.pageSize}
            onRowsPerPageChange={(event) => {
              table.setPageSize(Number(event.target.value));
            }}
            rowsPerPageOptions={[15, 25, 50, 100]}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BaselineExpressionTable;
