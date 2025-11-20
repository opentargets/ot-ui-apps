import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
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
  Typography,
} from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
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
import { max } from "d3";
import type React from "react";
import { Fragment, useCallback, useMemo, useState } from "react";
import { addScaledMedians } from "./addScaledMedians";
import DetailPlot from "./DetailPlot";

const datatypes = ["scrna-seq", "bulk rna-seq", "mass-spectrometry proteomics"];

// Declare module for TanStack Table
declare module "@tanstack/table-core" {
  interface FilterFns {
    searchFilterFn: FilterFn<unknown>;
  }

  interface FilterMeta {
    itemRank: RankingInfo;
  }
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
  data: BaselineExpressionRow[];
  DownloaderComponent?: React.ReactNode;
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

// group and sort data at 1st, 2nd and 3rd levels
// - currently preparing all data here, whereas a lot could be done on demand
function prepareData(data: BaselineExpressionRow[], groupByTissue: boolean) {
  const [topLevelName, otherName] = groupByTissue ? ["tissue", "celltype"] : ["celltype", "tissue"];

  // !! REMOVE !!
  window.data = data;

  data = structuredClone(data);

  const firstLevel = []; // array of data rows - unique parent biosample ids
  const secondLevel = {}; // object of array of objects, top-level keys: biosampleIds, bottom-level keys: datatypeIds
  const thirdLevel = {}; // each entry is an array of data rows where datatypeId is always datatypes[0]

  // 2nd and 3rd levels
  for (const row of data) {
    const topLevelBiosampleId = row[`${topLevelName}Biosample`]?.biosampleId; // the 2nd level id!
    const otherBiosampleId = row[`${otherName}Biosample`]?.biosampleId;
    if (!topLevelBiosampleId) continue;
    if (!otherBiosampleId) {
      // 2nd level
      const topLevelBiosampleParentId = row[`${topLevelName}BiosampleParent`].biosampleId;
      secondLevel[topLevelBiosampleParentId] ??= {};
      const _secondLevelName = // will add to the original data row and the table row
        row[`${groupByTissue ? "tissue" : "celltype"}Biosample`].biosampleName;
      const _secondLevelId = row[`${groupByTissue ? "tissue" : "celltype"}Biosample`].biosampleId;
      row._secondLevelName = _secondLevelName;
      row._secondLevelId = _secondLevelId;
      if (!secondLevel[topLevelBiosampleParentId][topLevelBiosampleId]) {
        secondLevel[topLevelBiosampleParentId][topLevelBiosampleId] = {};
        Object.defineProperty(
          // so not enumerable
          secondLevel[topLevelBiosampleParentId][topLevelBiosampleId],
          "_secondLevelName",
          { value: _secondLevelName, writable: true }
        );
        Object.defineProperty(
          // so not enumerable
          secondLevel[topLevelBiosampleParentId][topLevelBiosampleId],
          "_secondLevelId",
          { value: _secondLevelId, writable: true }
        );
      }
      secondLevel[topLevelBiosampleParentId][topLevelBiosampleId][row.datatypeId] = row;
    } else {
      // 3rd level
      if (row.datatypeId !== datatypes[0]) {
        throw Error(`Expected all third level rows to have datatypeid '${datatypes[0]}'`);
      }
      thirdLevel[topLevelBiosampleId] ??= [];
      thirdLevel[topLevelBiosampleId].push(row);
    }
  }

  // convert 2nd level objects to arrays
  for (const [bioSampleId, obj] of Object.entries(secondLevel)) {
    secondLevel[bioSampleId] = Object.values(obj);
  }

  // add _normalisedMedian to each 2nd level object - normalised by max median per datatypeid
  {
    const maxMedians = {};
    for (const datatype of datatypes) maxMedians[datatype] = 0;
    for (const arr of Object.values(secondLevel)) {
      for (const obj of arr) {
        for (const [datatypeId, row] of Object.entries(obj)) {
          if (maxMedians[datatypeId] < row.median) {
            maxMedians[datatypeId] = row.median;
          }
        }
      }
    }
    for (const arr of Object.values(secondLevel)) {
      for (const obj of arr) {
        for (const [datatypeId, row] of Object.entries(obj)) {
          row._normalisedMedian = row.median / maxMedians[datatypeId];
        }
      }
    }
  }

  // add _normalisedMedian to each 3rd level object - all 3rd level objects have datatypeId === datatypes[0]
  {
    let maxMedian = 0;
    for (const arr of Object.values(thirdLevel)) {
      for (const row of arr) {
        if (maxMedian < row.median) {
          maxMedian = row.median;
        }
      }
    }
    for (const arr of Object.values(thirdLevel)) {
      for (const row of arr) {
        row._normalisedMedian = row.median / maxMedian;
      }
    }
  }

  // 1st level
  for (const objects of Object.values(secondLevel)) {
    const firstLevelRow = {};
    for (const obj of objects) {
      for (const [datatypeId, row] of Object.entries(obj)) {
        const biosampleParent = row[`${groupByTissue ? "tissue" : "celltype"}BiosampleParent`];
        if (!firstLevelRow._firstLevelName) {
          Object.defineProperty(firstLevelRow, "_firstLevelName", {
            value: biosampleParent.biosampleName,
          });
          Object.defineProperty(firstLevelRow, "_firstLevelId", {
            value: biosampleParent.biosampleId,
          });
        }
        if (!(firstLevelRow[datatypeId]?.median >= row.median)) {
          const copiedRow = { ...row };
          copiedRow._firstLevelName = biosampleParent.biosampleName;
          copiedRow._firstLevelId = biosampleParent.biosampleId;
          delete copiedRow._secondLevelName;
          delete copiedRow._secondLevelId;
          firstLevelRow[datatypeId] = copiedRow;
        }
        // top-level specificity score may come from different object to that with the highest median
        if (!(firstLevelRow[datatypeId]._firstLevelSpecificityScore >= row.specificity_score)) {
          firstLevelRow[datatypeId]._firstLevelSpecificityScore = row.specificity_score;
        }
      }
    }
    firstLevel.push(firstLevelRow);
  }

  // get datatype (i.e. column) to sort on
  {
    let maxSpecificity = { datatype: null, score: -Infinity };
    for (const datatype of datatypes) {
      const score = max(firstLevel.map((obj) => obj[datatype]?._firstLevelSpecificityScore));
      if (score > maxSpecificity.score) {
        maxSpecificity = { datatype, score };
      }
    }
    Object.defineProperty(firstLevel, "_maxSpecificity", {
      value: maxSpecificity,
    });
  }

  console.log({ firstLevel, secondLevel, thirdLevel });
  return { firstLevel, secondLevel, thirdLevel };
}

const BaselineExpressionTable: React.FC<BaselineExpressionTableProps> = ({
  data,
  DownloaderComponent,
}) => {
  const classes = useStyles();
  const [sorting, setSorting] = useState<SortingState>([{ id: datatypes[0], desc: true }]);
  // const [sorting, setSorting] = useState<SortingState>([{ id: null, desc: true }]);
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

  const { firstLevel, secondLevel, thirdLevel } = useMemo(
    () => prepareData(data, groupByTissue),
    [data, groupByTissue]
  );

  addScaledMedians({ firstLevel, secondLevel, thirdLevel }, datatypes);

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
          <Box sx={{ display: "flex", alignItems: "center", pl: isFirstLevel ? null : 6 }}>
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
              }}
            >
              {cellContext.getValue()}
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
          <Box sx={{ display: "flex", justifyContent: "end" }}>
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
          </Box>
        );
      },
    }),
  ];
  for (const datatype of datatypes) {
    columns.push(
      // use -1 for missing value to make sorting work
      // - could not get nullish values to bottom with sortingFn: nullishComparator(...
      columnHelper.accessor((row) => row[datatype]?._normalisedMedian ?? -1, {
        header: datatype,
        enableSorting: true,
        // cell: (info) => {
        cell: (cellContext) => {
          const isFirstLevel = cellContext.row.original._firstLevelId;
          const isSecondLevel = !isFirstLevel && cellContext.row.depth === 1;
          const isExpanded = cellContext.row.getIsExpanded();
          const backgroundColor =
            datatype === datatypes[0] && isSecondLevel && isExpanded ? "grey.200" : null;
          const value = cellContext.getValue();
          if (value === -1) return <Box className={classes.medianCell}></Box>;
          const percent = value >= 0 ? value * 100 : 0; // normalised median is -1 if absent
          const specificityValue =
            cellContext.row.original[datatype]?._firstLevelSpecificityScore ??
            cellContext.row.original[datatype]?.specificity_score;

          return (
            <Box
              className={classes.medianCell}
              // sx={{
              //   backgroundColor,
              // }}
            >
              {/* {isFirstLevel && (
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
              )} */}
              <Box className={classes.barContainer}>
                <Box
                  className={
                    cellContext.row.original._firstLevelId ? classes.bar : classes.childBar
                  }
                  style={{ width: `${percent}%` }}
                />
                <Typography
                  variant="caption"
                  sx={{ position: "absolute", right: 0, top: -13, fontSize: 10.5, fontWeight: 500 }}
                >
                  {specificityValue ? specificityValue.toFixed(3) : String(specificityValue)}
                </Typography>
              </Box>
            </Box>
          );
        },
      })
    );
  }

  // create table instance
  // setSorting({ id: firstLevel._maxSpecificity.datatype, desc: true });
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

  return (
    <Box className={classes.tableContainer}>
      <Box sx={{ display: "flex", gap: 1, width: "100%", mb: 2, justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Select
              value={groupByTissue ? "tissue" : "celltype"}
              onChange={(e) => setGroupByTissue(e.target.value === "tissue")}
              variant="standard"
              disableUnderline
              sx={{
                "& .MuiSelect-select": {
                  border: "none",
                  padding: "4px 8px",
                  fontSize: "0.75rem",
                  minWidth: "auto",
                  "&:focus": {
                    backgroundColor: "transparent",
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              <MenuItem value="tissue">Tissue → Tissue Detail → Cell Detail</MenuItem>
              <MenuItem value="celltype">Cell → Cell Detail → Tissue Detail</MenuItem>
            </Select>
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
                          ...(isFirstLevel &&
                            isExpanded && {
                              backgroundColor: "grey.300",
                            }),
                        }}
                      >
                        {row.getVisibleCells().map((cell, index) => {
                          return (
                            <TableCell
                              sx={{
                                width: getColumnWidth(index),
                                border: "none",
                                padding: 0,
                                backgroundColor:
                                  _isSecondLevel &&
                                  isExpanded &&
                                  (cell.column.id === datatypes[0] ||
                                    cell.column.id === "expand" ||
                                    cell.column.id === "name")
                                    ? "grey.300"
                                    : null,
                                borderLeft: index === 0 && _isSecondLevel ? "1px solid" : "none",
                                borderRight:
                                  index === table.getVisibleLeafColumns().length - 1 &&
                                  _isSecondLevel
                                    ? "1px solid"
                                    : "none",
                                borderBottom: shouldShowBottomBorder ? "1px solid" : "none",
                                borderColor: "grey.300",
                              }}
                              key={cell.id}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                              borderLeft: _isSecondLevel ? "1px solid" : "none",
                              borderRight: _isSecondLevel ? "1px solid" : "none",
                              borderBottom: isLastChildOfParent ? "1px solid" : "none",
                              borderColor: "grey.300",
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
