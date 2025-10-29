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
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useMemo, useCallback, useState, useEffect, Fragment } from "react";
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
  tissueBiosampleFromSource?: string;
  celltypeBiosample?: {
    biosampleId: string;
    biosampleName: string;
  };
  celltypeBiosampleFromSource?: string;
  median: number;
  datasourceId: string;
  datatypeId: string;
}

type BaselineExpressionTableRow = {
  [K in typeof datatypes[number]]: BaselineExpressionDataRow; 
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
  groupRow: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.grey[100],
    },
    "& td": {
      padding: "0px 8px",
    },
  },
  nestedRow: {
    cursor: "pointer",
    backgroundColor: theme.palette.grey[50],
    "& td": {
      padding: "0px 8px",
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
}));

const columnHelper = createColumnHelper<BaselineExpressionTableRow>();

// group and sort data at 1st, 2nd and 3rd levels
// - currently preparing all data here, whereas a lot could be done on demand
function prepareData(data: BaselineExpressionRow[], groupByTissue: boolean) {

  const [topLevelName, otherName] = groupByTissue ? ["tissue", "celltype"] : ["celltype", "tissue"];

  data = structuredClone(data);

  let firstLevel = [];     // array of data rows - unique biosample ids
  const secondLevel = {};  // object of array of objects, top-level keys: biosampleIds, bottom-level keys: datatypeIds
  const thirdLevel = {};   // each entry is an array of data rows where datatypeId is always datatypes[0]

  // 2nd and 3rd levels
  for (const row of data) {
    const topLevelBiosampleFromSource = row[`${topLevelName}BiosampleFromSource`];
    const otherBiosampleFromSource = row[`${otherName}BiosampleFromSource`];
    if (!topLevelBiosampleFromSource) {  // 2nd level value for other name
      continue;
    } else if (!otherBiosampleFromSource) {  // 2nd level
      const topLevelBiosampleId = row[`${topLevelName}Biosample`].biosampleId;
      secondLevel[topLevelBiosampleId] ??= {};
      const _secondLevelName =  // will add to the original data row and the table row
        row[`${groupByTissue ? "tissue" : "celltype"}BiosampleFromSource`];
      row._secondLevelName = _secondLevelName;
      if (!secondLevel[topLevelBiosampleId][topLevelBiosampleFromSource]) {
        secondLevel[topLevelBiosampleId][topLevelBiosampleFromSource] = {};
        Object.defineProperty(  // so not enumerable
          secondLevel[topLevelBiosampleId][topLevelBiosampleFromSource],
          "_secondLevelName",
          { value: _secondLevelName, writable: true }
        );
      }
      secondLevel[topLevelBiosampleId][topLevelBiosampleFromSource][row.datatypeId] = row;
    } else {  // 3rd level
      if (row.datatypeId !== datatypes[0]) {
        throw Error(`Expected all third level rows to have datatypeid '${datatypes[0]}'`);
      }
      thirdLevel[topLevelBiosampleFromSource] ??= [];
      thirdLevel[topLevelBiosampleFromSource].push(row);
    }
  }
  
  // convert 2nd level objects to arrays
  for (const [bioSampleId, obj] of Object.entries(secondLevel)) {
    secondLevel[bioSampleId] = Object.values(obj);
  }

  // add _normalisedMedian to each 2nd level object - normalised by max median per datatypeid
  {
    const maxMedians =  {};
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
        const biosample = row[`${groupByTissue ? "tissue" : "celltype"}Biosample`];
        if (!firstLevelRow._firstLevelName) {
          Object.defineProperty(firstLevelRow, "_firstLevelName", { value: biosample.biosampleName });
          Object.defineProperty(firstLevelRow, "_firstLevelId", { value: biosample.biosampleId });
        }
        if (!(firstLevelRow[datatypeId]?.median >= row.median)) {
          const copiedRow = { ...row };
          copiedRow._firstLevelName = biosample.biosampleName;
          copiedRow._firstLevelId = biosample.biosampleId;
          delete copiedRow._secondLevelName;
          firstLevelRow[datatypeId] = copiedRow;
        }
      }
    }
    firstLevel.push(firstLevelRow);
  }

  console.log({ firstLevel, secondLevel, thirdLevel });
  return { firstLevel, secondLevel, thirdLevel };
}

const BaselineExpressionTable: React.FC<BaselineExpressionTableProps> = ({
  data,
  DownloaderComponent,
}) => {

  const classes = useStyles();
  const [sorting, setSorting] = useState<SortingState>([
    { id: datatypes[0], desc: true }
  ]); 
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [groupByTissue, setGroupByTissue] = useState(true);
  // const [searchTerm, setSearchTerm] = useState("");

  const { firstLevel, secondLevel, thirdLevel } =
    useMemo(() => prepareData(data, groupByTissue), [data, groupByTissue]);

  const getRowCanExpand = useCallback((row) => {
    return row.original._firstLevelId || thirdLevel[row.original._secondLevelName];
  }, [firstLevel, secondLevel, thirdLevel]);

  const getSubRows = useCallback((row) => {
    return secondLevel[row._firstLevelId] ?? [];
  }, [firstLevel, secondLevel]);

  const getName = useCallback((obj) => {
    let dataRow;
    for (const datatype of datatypes) {
      dataRow = obj[datatype];
      if (dataRow) break;
    }
    return dataRow._secondLevelName ?? dataRow._firstLevelName;
  }, [groupByTissue]);

  const getColumnWidth = (index) => {
    return index === 0 ? "5%" : index === 1 ? "35%" : `${60 / datatypes.length}%`;
  };

  const columns = [
    columnHelper.display({
      id: 'expand',
      header: "",
      cell: ({ row }) => row.getCanExpand() ? (
        <IconButton size="small" className={classes.expandButton}>
          {row.getIsExpanded() ? (
            <FontAwesomeIcon icon={faChevronUp} size="xs" />
          ) : (
            <FontAwesomeIcon icon={faChevronDown} size="xs" />
          )}
        </IconButton>
      ) : (
        null
      ),
    }),
    columnHelper.accessor(
      row => getName(row), {
        header: groupByTissue ? "Tissue" : "Cell Type",
        cell: (info) => {
          const isFirstLevel = info.row.original._firstLevelId;
          return (
            <Typography
              variant="caption"
              sx={{
                fontWeight: isFirstLevel ? "bold" : "normal",
                pl: isFirstLevel ? null: 4,
              }}
            >
              {info.getValue()}
            </Typography>
          );
        },
      }
    ),
  ];
  for (const datatype of datatypes) {
    columns.push(
      // use -1 for missing value to make sorting work
      // - could not get nullish values to bottom with sortingFn: nullishComparator(...
      columnHelper.accessor((row) => row[datatype]?._normalisedMedian ?? -1, {
        header: datatype,
        enableSorting: true,
        cell: (info) => {
          const value = info.getValue();
          const percent = value >= 0 ? value * 100 : 0;  // normalised median is -1 if absent
          return (
            <Box className={classes.medianCell}>
              <Box className={classes.barContainer}>
                <Box 
                  className={info.row.original._firstLevelId ? classes.bar : classes.childBar}
                  style={{ width: `${percent}%` }} />
              </Box>
            </Box>
          );
        },
      })
    );
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
    onExpandedChange: setExpanded,
    state: {
      sorting,
      pagination,
      expanded,
    },
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    // filterFns: {
    //   searchFilterFn: searchFilter,
    // },
  });

   return (
    <Box className={classes.tableContainer}>
      <Box sx={{ display: "flex", gap: 1, width: "100%", mb: 2, justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          {/* <TextField
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
          /> */}
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
                            width: getColumnWidth(index)
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
                  <Fragment key={row.id}>
                    {/* 1st and 2nd level rows */}
                    <TableRow
                      hover
                      className={`${row.original._firstLevelId ? classes.groupRow : classes.nestedRow} ${row.getCanExpand() ? "" : classes.cursorAuto }`}
                      onClick={() => {
                        if (row.getCanExpand()) row.toggleExpanded();
                      }}
                    >
                      {row.getVisibleCells().map((cell, index) => {
                        return (
                          <TableCell key={cell.id} style={{ width: getColumnWidth(index) }}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    
                    {/* 3rd level rows */}
                    {row.getIsExpanded() && row.original._secondLevelName && (
                    <tr>
                      <td colSpan={2}></td>
                      <td colSpan={datatypes.length}>
                        <DetailPlot
                          data={thirdLevel[row.original._secondLevelName]}
                          show={groupByTissue ? "celltype" : "tissue" }
                        />
                      </td>
                    </tr>
                    )}
                  </Fragment>
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
            rowsPerPageOptions={[15, 25, 50, 100]}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BaselineExpressionTable;