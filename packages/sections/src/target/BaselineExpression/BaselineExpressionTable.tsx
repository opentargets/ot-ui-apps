import { faChevronDown, faChevronUp, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
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
  type ExpandedState,
  type FilterFn,
  type PaginationState,
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useMemo, useState, useEffect } from "react";

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

// Types for the baseline expression data
interface BaselineExpressionRow {
  targetId: string;
  targetFromSourceId: string;
  tissueBiosample?: {
    biosampleId: string;
    biosampleName: string;
  };
  tissueBiosampleFromSource?: string;
  celltypeBiosample?: {
    biosampleId: string;
    biosampleName: string;
  };
  celltypeBiosampleFromSource?: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  datasourceId: string;
  datatypeId: string;
  unit: string;
}

// Types for grouped data structure
interface GroupedTissueData {
  tissueName: string;
  maxMedian: number;
  expressions: BaselineExpressionRow[];
  dataSourceValues: { [key: string]: number };
  isGroup: true;
}

interface GroupedCellTypeData {
  cellTypeName: string;
  maxMedian: number;
  expressions: BaselineExpressionRow[];
  dataSourceValues: { [key: string]: number };
  isGroup: true;
}

interface IndividualExpressionData extends BaselineExpressionRow {
  isGroup: false;
}

interface BaselineExpressionTableProps {
  data: BaselineExpressionRow[];
  symbol: string;
}

type TableData = GroupedTissueData | GroupedCellTypeData | IndividualExpressionData;

const useStyles = makeStyles((theme: Theme) => ({
  tableContainer: {
    marginTop: theme.spacing(1),
  },
  mainTable: {
    tableLayout: "fixed",
    width: "100%",
  },
  headerCell: {
    // backgroundColor: theme.palette.grey[100],
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
  },
  unitCell: {
    textAlign: "center",
    fontSize: "0.75rem",
  },
  dataSourceCell: {
    textAlign: "center",
    fontSize: "0.75rem",
  },
  barContainer: {
    height: "16px",
    backgroundColor: theme.palette.grey[200],
    borderRadius: "2px",
    position: "relative",
    margin: "2px 0",
  },
  bar: {
    height: "100%",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "2px",
    transition: "width 0.3s ease",
  },
  childBar: {
    height: "100%",
    backgroundColor: theme.palette.primary.light,
    borderRadius: "2px",
    transition: "width 0.3s ease",
  },
  barValue: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "5px",
    fontWeight: "bold",
    color: theme.palette.text.primary,
  },
  groupRow: {
    // backgroundColor: theme.palette.grey[50],
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.grey[100],
    },
    "& td": {
      padding: "0px 8px",
    },
  },
  childRow: {
    "& td": {
      padding: "0px 8px",
    },
  },
  nestedRow: {
    backgroundColor: theme.palette.grey[50],
    "& td": {
      padding: "0px 8px",
    },
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
  compactTableCell: {
    padding: "0px 8px",
    fontSize: "0.75rem",
  },
  compactNestedTableCell: {
    padding: "0px 8px",
    fontSize: "0.75rem",
  },
}));

const columnHelper = createColumnHelper<TableData>();

const BaselineExpressionTable: React.FC<BaselineExpressionTableProps> = ({
  data,
  DownloaderComponent,
}) => {
  const classes = useStyles();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [groupByTissue, setGroupByTissue] = useState(true); // true = tissue->celltype, false = celltype->tissue
  const [searchTerm, setSearchTerm] = useState("");

  // Get unique data sources with tabula_sapiens first
  const dataSources = useMemo(() => {
    const sources = new Set<string>();
    data.forEach((row) => {
      if (row.datasourceId) {
        sources.add(row.datasourceId);
      }
    });
    const sortedSources = Array.from(sources).sort();

    // Move tabula_sapiens to the front if it exists
    const tabulaIndex = sortedSources.indexOf("tabula_sapiens");
    if (tabulaIndex > -1) {
      sortedSources.splice(tabulaIndex, 1);
      sortedSources.unshift("tabula_sapiens");
    }

    return sortedSources;
  }, [data]);

  // Set default sorting by tabula_sapiens (first data source)
  useEffect(() => {
    if (dataSources.length > 0 && sorting.length === 0) {
      setSorting([{ id: `datasource_${dataSources[0]}`, desc: true }]);
    }
  }, [dataSources, sorting.length]);

  // Reset pagination when search term changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [searchTerm]);

  // Group data by tissue->celltype or celltype->tissue based on groupByTissue
  const groupedData = useMemo(() => {
    const grouped: { [key: string]: { [key: string]: { [key: string]: BaselineExpressionRow } } } =
      {};

    data.forEach((row) => {
      const tissueName =
        row.tissueBiosample?.biosampleName || row.tissueBiosampleFromSource || "Unknown";
      const cellTypeName =
        row.celltypeBiosample?.biosampleName || row.celltypeBiosampleFromSource || "Unknown";
      const dataSource = row.datasourceId || "Unknown";

      // Group by tissue->celltype or celltype->tissue
      const primaryKey = groupByTissue ? tissueName : cellTypeName;
      const secondaryKey = groupByTissue ? cellTypeName : tissueName;

      if (!grouped[primaryKey]) {
        grouped[primaryKey] = {};
      }
      if (!grouped[primaryKey][secondaryKey]) {
        grouped[primaryKey][secondaryKey] = {};
      }

      // Keep only one entry per combination per data source (take the one with highest median)
      if (
        !grouped[primaryKey][secondaryKey][dataSource] ||
        (row.median || 0) > (grouped[primaryKey][secondaryKey][dataSource].median || 0)
      ) {
        grouped[primaryKey][secondaryKey][dataSource] = row;
      }
    });

    const result: TableData[] = [];

    Object.entries(grouped).forEach(([primaryName, secondaryGroups]) => {
      const expressions: BaselineExpressionRow[] = [];
      const dataSourceValues: { [key: string]: number } = {};

      // Flatten all expressions and calculate max for each data source
      Object.entries(secondaryGroups).forEach(([, dataSources]) => {
        Object.entries(dataSources).forEach(([dataSource, row]) => {
          expressions.push(row);
          if (!dataSourceValues[dataSource]) {
            dataSourceValues[dataSource] = 0;
          }
          dataSourceValues[dataSource] = Math.max(dataSourceValues[dataSource], row.median || 0);
        });
      });

      // Add group row based on grouping mode
      if (groupByTissue) {
        result.push({
          tissueName: primaryName,
          maxMedian: Math.max(...Object.values(dataSourceValues)),
          expressions,
          dataSourceValues,
          isGroup: true,
        } as GroupedTissueData);
      } else {
        result.push({
          cellTypeName: primaryName,
          maxMedian: Math.max(...Object.values(dataSourceValues)),
          expressions,
          dataSourceValues,
          isGroup: true,
        } as GroupedCellTypeData);
      }
    });

    return result;
  }, [data, groupByTissue]);

  // Filter parent rows based on search term
  const filteredGroupedData = useMemo(() => {
    if (!searchTerm.trim()) {
      return groupedData;
    }

    const searchLower = searchTerm.toLowerCase();
    return groupedData.filter((group) => {
      if (!group.isGroup) return false;

      const nameToSearch = groupByTissue
        ? (group as GroupedTissueData).tissueName
        : (group as GroupedCellTypeData).cellTypeName;

      return nameToSearch.toLowerCase().includes(searchLower);
    });
  }, [groupedData, searchTerm, groupByTissue]);

  // Apply sorting to child expressions
  const sortedGroupedData = useMemo(() => {
    if (sorting.length === 0) return filteredGroupedData;

    const sortColumn = sorting[0];
    const sortDirection = sortColumn.desc ? "desc" : "asc";

    return filteredGroupedData.map((group) => {
      if (!group.isGroup) return group;

      const sortedExpressions = [...group.expressions];

      switch (sortColumn.id) {
        case "primary":
          sortedExpressions.sort((a, b) => {
            const aValue = groupByTissue
              ? a.celltypeBiosample?.biosampleName || a.celltypeBiosampleFromSource || "N/A"
              : a.tissueBiosample?.biosampleName || a.tissueBiosampleFromSource || "N/A";
            const bValue = groupByTissue
              ? b.celltypeBiosample?.biosampleName || b.celltypeBiosampleFromSource || "N/A"
              : b.tissueBiosample?.biosampleName || b.tissueBiosampleFromSource || "N/A";
            return sortDirection === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          });
          break;
        default:
          // Handle data source columns
          if (sortColumn.id.startsWith("datasource_")) {
            const dataSource = sortColumn.id.replace("datasource_", "");
            sortedExpressions.sort((a, b) => {
              const aValue = a.datasourceId === dataSource ? a.median || 0 : 0;
              const bValue = b.datasourceId === dataSource ? b.median || 0 : 0;
              return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
            });
          }
          break;
      }

      return {
        ...group,
        expressions: sortedExpressions,
      };
    });
  }, [filteredGroupedData, sorting, groupByTissue]);

  // Calculate max values for each data source for scaling
  const dataSourceMaxValues = useMemo(() => {
    const maxValues: { [key: string]: number } = {};
    dataSources.forEach((source) => {
      maxValues[source] = Math.max(
        ...data.filter((row) => row.datasourceId === source).map((row) => row.median || 0)
      );
    });
    return maxValues;
  }, [dataSources, data]);

  // Define columns
  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.display({
        id: "expand",
        header: "",
        cell: ({ row }) => {
          if (row.original.isGroup) {
            return (
              <IconButton
                size="small"
                className={classes.expandButton}
                onClick={() => row.toggleExpanded()}
              >
                {row.getIsExpanded() ? (
                  <FontAwesomeIcon icon={faChevronUp} size="xs" />
                ) : (
                  <FontAwesomeIcon icon={faChevronDown} size="xs" />
                )}
              </IconButton>
            );
          }
          return null;
        },
      }),
      columnHelper.accessor(
        (row) => {
          if (row.isGroup) {
            return groupByTissue
              ? (row as GroupedTissueData).tissueName
              : (row as GroupedCellTypeData).cellTypeName;
          }
          return groupByTissue
            ? (row as IndividualExpressionData).celltypeBiosample?.biosampleName ||
                (row as IndividualExpressionData).celltypeBiosampleFromSource ||
                "Unknown"
            : (row as IndividualExpressionData).tissueBiosample?.biosampleName ||
                (row as IndividualExpressionData).tissueBiosampleFromSource ||
                "Unknown";
        },
        {
          id: "primary",
          header: groupByTissue ? "Tissue" : "Cell Type",
          cell: (info) => (
            <Typography
              variant="caption"
              className={classes.tissueCell}
              style={{ fontWeight: info.row.original.isGroup ? "bold" : "normal" }}
            >
              {info.getValue()}
            </Typography>
          ),
        }
      ),
    ];

    // Add dynamic columns for each data source
    const dataSourceColumns = dataSources.map((dataSource) =>
      columnHelper.accessor(
        (row) => {
          if (row.isGroup) {
            return (row as GroupedTissueData).dataSourceValues[dataSource] || 0;
          }
          return 0; // Child rows will be handled in rendering
        },
        {
          id: `datasource_${dataSource}`,
          header: dataSource,
          cell: (info) => {
            const value = info.getValue();
            const maxValue = dataSourceMaxValues[dataSource] || 1;
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

            return (
              <Box className={classes.medianCell}>
                <Box className={classes.barContainer}>
                  <Box className={classes.bar} style={{ width: `${percentage}%` }} />
                </Box>
              </Box>
            );
          },
        }
      )
    );

    return [...baseColumns, ...dataSourceColumns];
  }, [classes, dataSources, dataSourceMaxValues, groupByTissue]);

  // Create table instance
  const table = useReactTable({
    data: sortedGroupedData,
    columns,
    state: {
      sorting,
      pagination,
      expanded,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    filterFns: {
      searchFilterFn: searchFilter,
    },
  });

  return (
    <Box className={classes.tableContainer}>
      <Box sx={{ display: "flex", gap: 1, width: "100%", mb: 2, justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder={`Search ${groupByTissue ? "tissues" : "cell types"}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faSearch} size="xs" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
            Grouping:
          </Typography> */}
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
              <MenuItem value="tissue">Group by Tissue → Cell Type</MenuItem>
              <MenuItem value="celltype">Group by Cell Type → Tissue</MenuItem>
            </Select>
          </Box>
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
                      let width = "auto";
                      if (index === 0)
                        width = "5%"; // Expand column
                      else if (index === 1)
                        width = "35%"; // Tissue column
                      else {
                        // Data source columns - ensure equal width
                        const dataSourceColumnWidth =
                          dataSources.length > 0 ? `${60 / dataSources.length}%` : "60%";
                        width = dataSourceColumnWidth;
                      }

                      return (
                        <TableCell
                          key={header.id}
                          className={classes.headerCell}
                          onClick={header.column.getToggleSortingHandler()}
                          style={{
                            cursor: header.column.getCanSort() ? "pointer" : "default",
                            width,
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
                {table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      hover
                      className={classes.groupRow}
                      onClick={() => row.toggleExpanded()}
                    >
                      {row.getVisibleCells().map((cell, index) => {
                        let width = "auto";
                        if (index === 0)
                          width = "5%"; // Expand column
                        else if (index === 1)
                          width = "35%"; // Tissue column
                        else {
                          // Data source columns - ensure equal width
                          const dataSourceColumnWidth =
                            dataSources.length > 0 ? `${60 / dataSources.length}%` : "60%";
                          width = dataSourceColumnWidth;
                        }

                        return (
                          <TableCell key={cell.id} style={{ width }}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    {row.getIsExpanded() && row.original.isGroup && (
                      <TableRow>
                        <TableCell colSpan={columns.length} style={{ padding: 0 }}>
                          <Collapse in={row.getIsExpanded()} timeout="auto" unmountOnExit>
                            <Box mx={1} mb={1}>
                              <Table
                                size="small"
                                className={classes.nestedTable}
                                style={{ fontSize: "0.75rem" }}
                              >
                                <TableHead sx={{ display: "none" }}>
                                  <TableRow>
                                    <TableCell style={{ width: "5%" }}></TableCell>
                                    <TableCell style={{ width: "35%" }}></TableCell>
                                    {dataSources.map((dataSource) => {
                                      const dataSourceColumnWidth =
                                        dataSources.length > 0
                                          ? `${60 / dataSources.length}%`
                                          : "60%";
                                      return (
                                        <TableCell
                                          key={dataSource}
                                          style={{ width: dataSourceColumnWidth }}
                                        ></TableCell>
                                      );
                                    })}
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {(() => {
                                    // Group expressions by secondary key (cell type or tissue)
                                    const secondaryGroups: {
                                      [key: string]: BaselineExpressionRow[];
                                    } = {};
                                    row.original.expressions.forEach((expression) => {
                                      const secondaryName = groupByTissue
                                        ? expression.celltypeBiosample?.biosampleName ||
                                          expression.celltypeBiosampleFromSource ||
                                          "Unknown"
                                        : expression.tissueBiosample?.biosampleName ||
                                          expression.tissueBiosampleFromSource ||
                                          "Unknown";
                                      if (!secondaryGroups[secondaryName]) {
                                        secondaryGroups[secondaryName] = [];
                                      }
                                      secondaryGroups[secondaryName].push(expression);
                                    });

                                    return Object.entries(secondaryGroups).map(
                                      ([secondaryName, expressions]) => (
                                        <TableRow key={secondaryName} className={classes.nestedRow}>
                                          <TableCell
                                            className={classes.nestedTableCell}
                                            style={{ width: "5%" }}
                                          >
                                            {/* Empty cell to align with expand column */}
                                          </TableCell>
                                          <TableCell
                                            className={classes.nestedTableCell}
                                            style={{ paddingLeft: 40, width: "35%" }}
                                          >
                                            <Typography variant="caption">
                                              {secondaryName}
                                            </Typography>
                                          </TableCell>
                                          {dataSources.map((dataSource) => {
                                            const expression = expressions.find(
                                              (expr) => expr.datasourceId === dataSource
                                            );
                                            const value = expression?.median || 0;

                                            // Scale relative to parent group's max value for this data source
                                            const parentMaxValue = groupByTissue
                                              ? (row.original as GroupedTissueData)
                                                  .dataSourceValues[dataSource] || 1
                                              : (row.original as GroupedCellTypeData)
                                                  .dataSourceValues[dataSource] || 1;
                                            const percentage =
                                              parentMaxValue > 0
                                                ? (value / parentMaxValue) * 100
                                                : 0;
                                            const dataSourceColumnWidth =
                                              dataSources.length > 0
                                                ? `${60 / dataSources.length}%`
                                                : "60%";

                                            return (
                                              <TableCell
                                                key={dataSource}
                                                className={`${classes.medianCell} ${classes.nestedTableCell}`}
                                                style={{ width: dataSourceColumnWidth }}
                                              >
                                                <Box className={classes.barContainer}>
                                                  <Box
                                                    className={classes.childBar}
                                                    style={{ width: `${percentage}%` }}
                                                  />
                                                </Box>
                                              </TableCell>
                                            );
                                          })}
                                        </TableRow>
                                      )
                                    );
                                  })()}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
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
            rowsPerPageOptions={[10, 25, 30, 50, 100]}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BaselineExpressionTable;
