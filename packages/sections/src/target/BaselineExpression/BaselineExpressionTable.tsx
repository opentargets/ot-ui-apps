import { faCaretDown, faCaretUp, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { green, grey } from "@mui/material/colors";
import type { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { naLabel } from "@ot/constants";
import { sentenceCase } from "@ot/utils";
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
import { Fragment, useCallback, useEffect, useState } from "react";
import { Tooltip } from "ui";
import BaselineTooltipTable from "./BaselineTooltipTable";
import DetailPlot from "./DetailPlot";

const specificityColors = {
  high: green[500],
  low: grey[200],
};

const specificityCircleWidth = "12px";

const datatypeNameLookup = {
  "scrna-seq": "Single-cell RNA-seq",
  "bulk rna-seq": "Bulk RNA-seq",
  "mass-spectrometry proteomics": "Mass spectrometry proteomics",
};

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
    maxWidth: "1420px",
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: "0.75rem",
  },
  tissueCell: {
    fontWeight: "bold",
    fontSize: "0.75rem",
  },
  medianCell: {
    textAlign: "center",
    fontSize: "0.75rem",
  },
  barContainer: {
    height: "12px",
    backgroundColor: theme.palette.grey[200],
    position: "relative",
    width: "100%",
    margin: "2px 0",
    // pointerEvents: "none",
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
    pointerEvents: "none",
  },
  childBar: {
    height: "100%",
    // backgroundColor: "#BFDAEE",
    backgroundColor: theme.palette.primary.main,
    // borderRadius: "2px",
    transition: "width 0.3s ease",
    pointerEvents: "none",
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

function ViewToggleButton({ value, view, hasSpecific, specificityThreshold }) {
  return (
    <Tooltip
      title={
        <Typography variant="caption">
          {hasSpecific
            ? `At least one ${view} has a high specificity score`
            : `No ${view}s have a high specificify score`}
        </Typography>
      }
      placement="top-start"
    >
      <ToggleButton
        value={value}
        aria-label={view}
        sx={{ border: `1px solid transparent` }} // prevents jumping on change
      >
        <Box
          sx={{
            display: "flex",
            gap: 0.75,
            alignItems: "center",
          }}
        >
          <Box sx={{ fontSize: "13px" }}>{sentenceCase(view)}</Box>
          {/* <FontAwesomeIcon
            icon={faCircle}
            fontSize="12px"
            color={specificityColors[hasSpecific ? "high" : "low"]}
          /> */}
          <Box
            sx={{
              width: specificityCircleWidth,
              height: specificityCircleWidth,
              bgcolor: specificityColors[hasSpecific ? "high" : "low"],
              border: hasSpecific ? "none" : `1px solid ${grey[400]}`,
              borderRadius: "6px",
            }}
          />
        </Box>
      </ToggleButton>
    </Tooltip>
  );
}

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

          // if (newlyExpanded) {
          //   // Close all other second-level rows except the newly expanded one
          //   secondLevelRows.forEach((id) => {
          //     if (id !== newlyExpanded) {
          //       result[id] = false;
          //     }
          //   });
          // }
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
      return dataRow._secondLevelName
        ? { name: dataRow._secondLevelName, id: dataRow._secondLevelId }
        : { name: dataRow._firstLevelName, id: dataRow._firstLevelId };
    },
    [groupByTissue]
  );

  const getColumnWidth = (index) => {
    return index === 0 ? "30%" : `${70 / datatypes.length}%`;
  };

  const columns = [
    columnHelper.accessor((row) => getName(row), {
      id: "name",
      header: groupByTissue ? "Tissue" : "Cell Type",
      cell: (cellContext) => {
        const isFirstLevel = cellContext.row.original._firstLevelId;
        // console.log(cellContext.getValue());
        const { name, id } = cellContext.getValue();
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              pl: isFirstLevel ? null : 5,
            }}
          >
            {!isFirstLevel && cellContext.row.getIsExpanded() && (
              <Box
                sx={{
                  position: "absolute",
                  height: "1px",
                  width: "80px",
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
                fontWeight: isFirstLevel ? "600" : "500",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              <Tooltip
                title={name}
                placement="top"
                slotProps={{
                  popper: {
                    sx: { pointerEvents: "none" },
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [-20, -8],
                        },
                      },
                    ],
                  },
                }}
              >
                {name}
              </Tooltip>
            </Typography>
          </Box>
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
            accessorKey: datatype,
            header: datatypeNameLookup[datatype] ?? datatype,
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
              const specificityScore =
                cellContext.row.original[datatype][
                  isFirstLevel ? "_firstLevelSpecificityScore" : "specificity_score"
                ];

              return (
                <Tooltip
                  placement="top-start"
                  slotProps={{
                    popper: {
                      sx: { pointerEvents: "none" },
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: [-3, -10],
                          },
                        },
                      ],
                    },
                    tooltip: {
                      sx: {
                        maxWidth: 550,
                      },
                    },
                  }}
                  title={
                    <BaselineTooltipTable
                      data={cellContext.row.original[datatype]}
                      show={viewType}
                      showSource={isSecondLevel && datatype !== datatypes[0]}
                    />
                  }
                >
                  <Box className={classes.medianCell}>
                    <Box className={classes.barContainer}>
                      <Box
                        className={
                          cellContext.row.original._firstLevelId ? classes.bar : classes.childBar
                        }
                        style={{ width: `${percent}%` }}
                      />

                      {specificityScore != null && (
                        <Box
                          sx={{
                            position: "absolute",
                            right: -18,
                            top: -1,
                            fontSize: 10,
                            fontWeight: 500,
                            // color: isFirstLevel ? "primary.dark" : "primary.main",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faCircle}
                            // size="lg"
                            fontSize={specificityCircleWidth}
                            color={
                              specificityColors[
                                specificityScore >= specificityThreshold ? "high" : "low"
                              ]
                            }
                          />
                        </Box>
                      )}

                      {/* {cellContext.row.original[datatype][
                        isFirstLevel ? "_firstLevelSpecificityScore" : "specificity_score"
                      ] >= specificityThreshold && (
                        <Box
                          sx={{
                            position: "absolute",
                            right: -18,
                            top: -1,
                            fontSize: 10,
                            fontWeight: 500,
                            // color: isFirstLevel ? "primary.dark" : "primary.main",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faCircle}
                            size="lg"
                            color={specificityColors.high}
                          />
                        </Box>
                      )} */}
                      {isSecondLevel && datatype === datatypes[0] && (
                        <Box
                          sx={{
                            position: "absolute",
                            left: -22,
                            top: -6,
                          }}
                        >
                          <IconButton
                            size="small"
                            className={classes.expandColumn}
                            sx={{
                              visibility: cellContext.row.getCanExpand() ? "visible" : "hidden",
                            }} // keeps all rows same height
                          >
                            {cellContext.row.getIsExpanded() ? (
                              <FontAwesomeIcon icon={faCaretUp} size="xs" />
                            ) : (
                              <FontAwesomeIcon icon={faCaretDown} size="xs" />
                            )}
                          </IconButton>
                        </Box>
                      )}
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
      <Box
        sx={{
          display: "flex",
          gap: 2,
          width: "100%",
          mb: 2,
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", columnGap: 4, rowGap: 2, flexWrap: "wrap" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ToggleButtonGroup
              value={groupByTissue ? "tissue" : "celltype"}
              aria-label="toggle view"
              // sx={{ p: 0, bgcolor: "transparent" }}
              exclusive
              onChange={(event, newValue) => setGroupByTissue(newValue === "tissue")}
              // color="secondary"
            >
              <ViewToggleButton
                value="tissue"
                view="tissue"
                hasSpecific={data.tissue.firstLevel._maxSpecificity.score >= specificityThreshold}
                specificityThreshold={specificityThreshold}
              />
              <ViewToggleButton
                value="celltype"
                view="cell type"
                hasSpecific={data.celltype.firstLevel._maxSpecificity.score >= specificityThreshold}
                specificityThreshold={specificityThreshold}
              />
            </ToggleButtonGroup>
          </Box>
          <Tooltip title={`Threshold specificity score: ${specificityThreshold}`}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontSize: "12px" }}>
                Specificity
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <FontAwesomeIcon
                  icon={faCircle}
                  fontSize={specificityCircleWidth}
                  color={specificityColors.high}
                />
                <Typography variant="caption">high</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <FontAwesomeIcon
                  icon={faCircle}
                  fontSize={specificityCircleWidth}
                  color={specificityColors.low}
                />
                <Typography variant="caption">low</Typography>
              </Box>
            </Box>
          </Tooltip>
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
                          sx={{
                            cursor: header.column.getCanSort() ? "pointer" : "default",
                            width: getColumnWidth(index),
                            border: "none",
                            textAlign: "center",
                          }}
                        >
                          {header.isPlaceholder ? null : (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: index === 0 ? "start" : "center",
                              }}
                            >
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
                            // backgroundColor: "grey.200",
                            outlineOffset: "-1px",
                            outline: "solid 1px",
                            outlineColor: "grey.400",
                          },
                          ...(row.getCanExpand() && {
                            "&:hover": {
                              // backgroundColor: "grey.200",
                              outlineOffset: "-1px",
                              outline: isFirstLevel || !isExpanded ? "solid 1px" : "none",
                              outlineColor: "grey.400",
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
                          const isSingleCellColumn =
                            _isSecondLevel && isExpanded && cell.column.id === datatypes[0];
                          return (
                            <TableCell
                              sx={{
                                position: "relative",
                                height: "24px",
                                width: getColumnWidth(index),
                                border: "none",
                                px: 5,
                                // px: 2.8,
                                py: 0,
                                backgroundColor: isSingleCellColumn ? "grey.50" : null,
                                borderStyle: "solid",
                                borderColor: "grey.300",
                                borderTopWidth: 0,
                                borderBottomWidth:
                                  _isSecondLevel && isExpanded && !isSingleCellColumn ? "1px" : 0,
                                borderLeftWidth: 0,
                                borderRightWidth: 0,
                              }}
                              key={cell.id}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              {isSingleCellColumn && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    pointerEvents: "none",
                                    borderStyle: "solid",
                                    borderColor: "grey.300",
                                    borderTopWidth: "1px",
                                    borderBottomWidth: 0,
                                    borderLeftWidth: isSingleCellColumn ? "1px" : 0,
                                    borderRightWidth: isSingleCellColumn ? "1px" : 0,
                                    borderTopLeftRadius: isSingleCellColumn ? "3px" : 0,
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
