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
import React, { useMemo, useState } from "react";
import { nullishComparator } from "@ot/utils";
import { naLabel } from "@ot/constants";

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

interface BaselineExpressionTableRow {
  "scrna-seq"?: BaselineExpressionDataRow,
  "bulk rna-seq"?: BaselineExpressionDataRow,
  "mass-spectrometry proteomics"?: BaselineExpressionDataRow,
  "_biosample": {
    biosampleId: string;
    biosampleName: string;
  }
}

// Types for grouped data structure
interface GroupedTissueData {
  tissueName: string;
  maxMedian: number;
  expressions: BaselineExpressionRow[];
  dataTypeValues: { [key: string]: number };
  isGroup: true;
}

interface GroupedCellTypeData {
  cellTypeName: string;
  maxMedian: number;
  expressions: BaselineExpressionRow[];
  dataTypeValues: { [key: string]: number };
  isGroup: true;
}

interface IndividualExpressionData extends BaselineExpressionRow {
  isGroup: false;
}

interface BaselineExpressionTableProps {
  data: BaselineExpressionRow[];
  DownloaderComponent?: React.ReactNode;
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
}));

const columnHelper = createColumnHelper<BaselineExpressionTableRow>();

// group and sort data at 1st, 2nd and 3rd levels
// - currently preparing all data here, whereas a lot could be done on demand
function prepareData(data: BaselineExpressionRow[], groupByTissue: boolean = true) {
  const [topLevelName, otherName] = groupByTissue ? ["tissue", "celltype"] : ["celltype", "tissue"];

  data = structuredClone(data);

  let firstLevel = [];     // array of data rows - unique biosample ids
  const secondLevel = {};  // object of array of objects, top-level keys: biosampleIds, bottom-level keys: datatypeIds
  const thirdLevel = {};   // each entry is an array of data rows where datatypeId is always "scrna-seq"

  // !!!!NORMALISATION POSSIBLE FLAED:
  // - SHOULD BE ONLY FOR SECOND LEVEL AND UP?
  // - SHOULD BE ONLY FOR TISSUE OR CELLTYPE?
  // - !! CAN FIX BOTH BY DOING MAX COMPUTATIONS ONLY DOING THE COMPUTATION WHEN GETTING THE 2ND LEVEL?? 


  // 2nd and 3rd levels
  for (const row of data) {
    const topLevelBiosampleFromSource = row[`${topLevelName}BiosampleFromSource`];
    const otherBiosampleFromSource = row[`${otherName}BiosampleFromSource`];
    if (!topLevelBiosampleFromSource) {  // 2nd level value for other name
      continue;
    } else if (!otherBiosampleFromSource) {  // 2nd level
      const topLevelBiosampleId = row[`${topLevelName}Biosample`].biosampleId;
      secondLevel[topLevelBiosampleId] ??= {};
      secondLevel[topLevelBiosampleId][topLevelBiosampleFromSource] ??= {};
      secondLevel[topLevelBiosampleId][topLevelBiosampleFromSource][row.datatypeId] = row;
    } else {  // 3rd level
      if (row.datatypeId !== "scrna-seq") {
        throw Error("Expected all third level rows to have datatypeid 'scrna-seq'");
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
    const maxMedians =  { "scrna-seq": 0, "bulk rna-seq": 0, "mass-spectrometry proteomics": 0 };
    for (const arr of Object.values(secondLevel)) {
      for (const obj of arr) {
        for (const row of Object.values(obj)) {
          if (maxMedians[row.datatypeId] < row.median) {
            maxMedians[row.datatypeId] = row.median;
          }
        }
      }
    }
    for (const arr of Object.values(secondLevel)) {
      for (const obj of arr) {
        for (const row of Object.values(obj)) {
          row._normalisedMedian = row.median / maxMedians[row.datatypeId];
        }
      }
    }
  }

  // add _normalisedMedian to each 3rd level object - all 3rd level objects are scrna-seq 
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
        if (!(firstLevelRow[datatypeId]?.median >= row.median)) {
          firstLevelRow[row.datatypeId] = row;
          firstLevelRow._biosample ??= row[`${groupByTissue ? "tissue" : "celltype"}Biosample`];
        }
      }
    }
    firstLevel.push(firstLevelRow);
  }

  // sort all levels
  const scrnaSeqComparator = nullishComparator(
    (a, b) => b - a,
    a => a["scrna-seq"]?.median
  );
  firstLevel.sort(scrnaSeqComparator);  // prob unnec since handled by table
  for (const array of Object.values(secondLevel)) {
    array.sort(scrnaSeqComparator);
  }
  for (const array of Object.values(thirdLevel)) {
    array.sort(nullishComparator((a, b) => b - a, a => a.median));
  }

  return { firstLevel, secondLevel, thirdLevel };
}

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
  const [groupByTissue, setGroupByTissue] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const processedData = useMemo(() => prepareData(data, true)); // groupByTissue));
  console.log(processedData);
  // console.log(prepareData(data).firstLevel.map(r => r["scrna-seq"]?.median));
  // console.log(groupData(data).firstLevel.map(r => Object.values(r)[0].tissueBiosample.biosampleName));

  // accessors that depend on if grouping by tissue or cell type at top level
  // const getBiosampleFromSource = groupByTissue
  //   ? (row => row.tissueBiosampleFromSource)
  //   : (row => row.celltypeBiosampleFromSource);
  // const getBioSampleId = groupByTissue
  //   ? (row => row.tissueBiosample.biosampleId)
  //   : (row => row.celltypeBiosample.biosampleId);

  const columns = [
    columnHelper.accessor(
      row => row._biosample.biosampleName, {
      header: groupByTissue ? "Tissue" : "Cell Type",
      // cell: ,
    }),
    columnHelper.accessor(row => row["scrna-seq"]?._normalisedMedian?.toFixed?.(2) ?? naLabel, {
      header: "scrna-seq",
    }),
    columnHelper.accessor(row => row["bulk rna-seq"]?._normalisedMedian?.toFixed?.(2) ?? naLabel, {
      header: "bulk rna-seq",
    }),
    columnHelper.accessor(row => row["mass-spectrometry proteomics"]?._normalisedMedian?.toFixed?.(2) ?? naLabel, {
      header: "mass-spectrometry proteomics",
    }),
  ];

  // create table instance
  const table = useReactTable({
    data: processedData.firstLevel,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // state: {
    //   sorting,
    //   pagination,
    //   expanded,
    // },
    // onSortingChange: setSorting,
    // onPaginationChange: setPagination,
    // onExpandedChange: setExpanded,
    // getCoreRowModel: getCoreRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // manualPagination: false,
    // filterFns: {
    //   searchFilterFn: searchFilter,
    // },
  });

  return (
    <Box>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </Box>
  );

}

export default BaselineExpressionTable;

  // // Define columns
  // const columns = useMemo(() => {
  //   const baseColumns = [
  //     columnHelper.display({
  //       id: "expand",
  //       header: "",
  //       cell: ({ row }) => (
  //         <IconButton
  //           size="small"
  //           className={classes.expandButton}
  //           onClick={() => row.toggleExpanded()}
  //         >
  //           <FontAwesomeIcon
  //             icon={row.getIsExpanded() ? faChevronUp : faChevronDown}
  //             size="xs"
  //           />
  //         </IconButton>
  //       );
  //     }),

  //     columnHelper.accessor(
  //       (row) => {
  //         if (row.isGroup) {
  //           return groupByTissue
  //             ? (row as GroupedTissueData).tissueName
  //             : (row as GroupedCellTypeData).cellTypeName;
  //         }
  //         return groupByTissue
  //           ? (row as IndividualExpressionData).celltypeBiosample?.biosampleName ||
  //               (row as IndividualExpressionData).celltypeBiosampleFromSource ||
  //               "No cell type"
  //           : (row as IndividualExpressionData).tissueBiosample?.biosampleName ||
  //               (row as IndividualExpressionData).tissueBiosampleFromSource ||
  //               "No tissue";
  //       },
  //       {
  //         id: "primary",
  //         header: groupByTissue ? "Tissue" : "Cell Type",
  //         cell: (info) => (
  //           <Typography
  //             variant="caption"
  //             className={classes.tissueCell}
  //             style={{ fontWeight: info.row.original.isGroup ? "bold" : "normal" }}
  //           >
  //             {info.getValue()}
  //           </Typography>
  //         ),
  //       }
  //     ),
  //   ];

  //   // Add dynamic columns for each data type
  //   const dataTypeColumns = dataTypes.map((dataType) =>
  //     columnHelper.accessor(
  //       (row) => {
  //         if (row.isGroup) {
  //           return (row as GroupedTissueData).dataTypeValues[dataType] || 0;
  //         }
  //         return 0; // Child rows will be handled in rendering
  //       },
  //       {
  //         id: `datatype_${dataType}`,
  //         header: dataType,
  //         cell: (info) => {
  //           const value = info.getValue();
  //           const maxValue = dataTypeMaxValues[dataType] || 1;
  //           const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

  //           return (
  //             <Box className={classes.medianCell}>
  //               <Box className={classes.barContainer}>
  //                 <Box className={classes.bar} style={{ width: `${percentage}%` }} />
  //               </Box>
  //             </Box>
  //           );
  //         },
  //       }
  //     )
  //   );

  //   return [...baseColumns, ...dataTypeColumns];
  // }, [classes, dataTypes, dataTypeMaxValues, groupByTissue]);

  // // Create table instance
  // const table = useReactTable({
  //   data: sortedGroupedData,
  //   columns,
  //   state: {
  //     sorting,
  //     pagination,
  //     expanded,
  //   },
  //   onSortingChange: setSorting,
  //   onPaginationChange: setPagination,
  //   onExpandedChange: setExpanded,
  //   getCoreRowModel: getCoreRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   manualPagination: false,
  //   filterFns: {
  //     searchFilterFn: searchFilter,
  //   },
  // });

  // return (
  //   <Box className={classes.tableContainer}>
  //     <Box sx={{ display: "flex", gap: 1, width: "100%", mb: 2, justifyContent: "space-between" }}>
  //       <Box sx={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
  //         <TextField
  //           size="small"
  //           placeholder={`Search ${groupByTissue ? "tissues" : "cell types"}...`}
  //           value={searchTerm}
  //           onChange={(e) => setSearchTerm(e.target.value)}
  //           InputProps={{
  //             startAdornment: (
  //               <InputAdornment position="start">
  //                 <FontAwesomeIcon icon={faSearch} size="xs" />
  //               </InputAdornment>
  //             ),
  //           }}
  //           sx={{ minWidth: 200 }}
  //         />
  //         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  //           {/* <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>
  //           Grouping:
  //         </Typography> */}
  //           <Select
  //             value={groupByTissue ? "tissue" : "celltype"}
  //             onChange={(e) => setGroupByTissue(e.target.value === "tissue")}
  //             variant="standard"
  //             disableUnderline
  //             sx={{
  //               "& .MuiSelect-select": {
  //                 border: "none",
  //                 padding: "4px 8px",
  //                 fontSize: "0.75rem",
  //                 minWidth: "auto",
  //                 "&:focus": {
  //                   backgroundColor: "transparent",
  //                 },
  //               },
  //               "& .MuiOutlinedInput-notchedOutline": {
  //                 border: "none",
  //               },
  //               "&:hover .MuiOutlinedInput-notchedOutline": {
  //                 border: "none",
  //               },
  //               "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
  //                 border: "none",
  //               },
  //             }}
  //           >
  //             <MenuItem value="tissue">Group by Tissue → Cell Type</MenuItem>
  //             <MenuItem value="celltype">Group by Cell Type → Tissue</MenuItem>
  //           </Select>
  //         </Box>
  //       </Box>
  //       <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>{DownloaderComponent}</Box>
  //     </Box>
  //     <Grid justifyContent="center" container>
  //       <Grid item xs={12} md={10}>
  //         <TableContainer component={Paper} elevation={0}>
  //           <Table size="small" className={classes.mainTable} style={{ fontSize: "0.75rem" }}>
  //             <TableHead>
  //               {table.getHeaderGroups().map((headerGroup) => (
  //                 <TableRow key={headerGroup.id}>
  //                   {headerGroup.headers.map((header, index) => {
  //                     let width = "auto";
  //                     if (index === 0)
  //                       width = "5%"; // Expand column
  //                     else if (index === 1)
  //                       width = "35%"; // Tissue column
  //                     else {
  //                       // Data source columns - ensure equal width
  //                       const dataTypeColumnWidth =
  //                         dataTypes.length > 0 ? `${60 / dataTypes.length}%` : "60%";
  //                       width = dataTypeColumnWidth;
  //                     }

  //                     return (
  //                       <TableCell
  //                         key={header.id}
  //                         className={classes.headerCell}
  //                         onClick={header.column.getToggleSortingHandler()}
  //                         style={{
  //                           cursor: header.column.getCanSort() ? "pointer" : "default",
  //                           width,
  //                         }}
  //                       >
  //                         {header.isPlaceholder ? null : (
  //                           <Box display="flex" alignItems="center">
  //                             <Typography variant="caption" style={{ fontWeight: "bold" }}>
  //                               {flexRender(header.column.columnDef.header, header.getContext())}
  //                             </Typography>
  //                             {header.column.getCanSort() && (
  //                               <TableSortLabel
  //                                 active={!!header.column.getIsSorted()}
  //                                 direction={header.column.getIsSorted() === "asc" ? "asc" : "desc"}
  //                               />
  //                             )}
  //                           </Box>
  //                         )}
  //                       </TableCell>
  //                     );
  //                   })}
  //                 </TableRow>
  //               ))}
  //             </TableHead>
  //             <TableBody>
  //               {table.getRowModel().rows.map((row) => (
  //                 <React.Fragment key={row.id}>
  //                   <TableRow
  //                     hover
  //                     className={classes.groupRow}
  //                     onClick={() => row.toggleExpanded()}
  //                   >
  //                     {row.getVisibleCells().map((cell, index) => {
  //                       let width = "auto";
  //                       if (index === 0)
  //                         width = "5%"; // Expand column
  //                       else if (index === 1)
  //                         width = "35%"; // Tissue column
  //                       else {
  //                         // Data type columns - ensure equal width
  //                         const dataTypeColumnWidth =
  //                           dataTypes.length > 0 ? `${60 / dataTypes.length}%` : "60%";
  //                         width = dataTypeColumnWidth;
  //                       }

  //                       return (
  //                         <TableCell key={cell.id} style={{ width }}>
  //                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
  //                         </TableCell>
  //                       );
  //                     })}
  //                   </TableRow>
  //                   {row.getIsExpanded() && row.original.isGroup && (
  //                     <TableRow>
  //                       <TableCell colSpan={columns.length} style={{ padding: 0 }}>
  //                         <Collapse in={row.getIsExpanded()} timeout="auto" unmountOnExit>
  //                           <Box mx={1} mb={1}>
  //                             <Table
  //                               size="small"
  //                               className={classes.nestedTable}
  //                               style={{ fontSize: "0.75rem" }}
  //                             >
  //                               <TableHead sx={{ display: "none" }}>
  //                                 <TableRow>
  //                                   <TableCell style={{ width: "5%" }}></TableCell>
  //                                   <TableCell style={{ width: "35%" }}></TableCell>
  //                                   {dataTypes.map((dataType) => {
  //                                     const dataTypeColumnWidth =
  //                                       dataTypes.length > 0
  //                                         ? `${60 / dataTypes.length}%`
  //                                         : "60%";
  //                                     return (
  //                                       <TableCell
  //                                         key={dataType}
  //                                         style={{ width: dataTypeColumnWidth }}
  //                                       ></TableCell>
  //                                     );
  //                                   })}
  //                                 </TableRow>
  //                               </TableHead>
  //                               <TableBody>
  //                                 {(() => {
  //                                   // Group expressions by secondary key (cell type or tissue)
  //                                   const secondaryGroups: {
  //                                     [key: string]: BaselineExpressionRow[];
  //                                   } = {};
  //                                   row.original.expressions.forEach((expression) => {
  //                                     const tissueName = expression.tissueBiosample?.biosampleName || expression.tissueBiosampleFromSource;
  //                                     const cellTypeName = expression.celltypeBiosample?.biosampleName || expression.celltypeBiosampleFromSource;
                                      
  //                                     // For nested table: only show rows that have BOTH tissue and cell type information
  //                                     if (!tissueName || !cellTypeName) {
  //                                       return;
  //                                     }
                                      
  //                                     const secondaryName = groupByTissue ? cellTypeName : tissueName;
                                      
  //                                     if (!secondaryGroups[secondaryName]) {
  //                                       secondaryGroups[secondaryName] = [];
  //                                     }
  //                                     secondaryGroups[secondaryName].push(expression);
  //                                   });

  //                                   return Object.entries(secondaryGroups).map(
  //                                     ([secondaryName, expressions]) => (
  //                                       <TableRow key={secondaryName} className={classes.nestedRow}>
  //                                         <TableCell
  //                                           className={classes.nestedTableCell}
  //                                           style={{ width: "5%" }}
  //                                         >
  //                                           {/* Empty cell to align with expand column */}
  //                                         </TableCell>
  //                                         <TableCell
  //                                           className={classes.nestedTableCell}
  //                                           style={{ paddingLeft: 40, width: "35%" }}
  //                                         >
  //                                           <Typography variant="caption">
  //                                             {secondaryName}
  //                                           </Typography>
  //                                         </TableCell>
  //                                         {dataTypes.map((dataType) => {
  //                                           const expression = expressions.find(
  //                                             (expr) => expr.datatypeId === dataType
  //                                           );
  //                                           const value = expression?.median || 0;

  //                                           // Scale relative to parent group's max value for this data type
  //                                           const parentMaxValue = groupByTissue
  //                                             ? (row.original as GroupedTissueData)
  //                                                 .dataTypeValues[dataType] || 1
  //                                             : (row.original as GroupedCellTypeData)
  //                                                 .dataTypeValues[dataType] || 1;
  //                                           const percentage =
  //                                             parentMaxValue > 0
  //                                               ? (value / parentMaxValue) * 100
  //                                               : 0;
  //                                           const dataTypeColumnWidth =
  //                                             dataTypes.length > 0
  //                                               ? `${60 / dataTypes.length}%`
  //                                               : "60%";

  //                                           return (
  //                                             <TableCell
  //                                               key={dataType}
  //                                               className={`${classes.medianCell} ${classes.nestedTableCell}`}
  //                                               style={{ width: dataTypeColumnWidth }}
  //                                             >
  //                                               <Box className={classes.barContainer}>
  //                                                 <Box
  //                                                   className={classes.childBar}
  //                                                   style={{ width: `${percentage}%` }}
  //                                                 />
  //                                               </Box>
  //                                             </TableCell>
  //                                           );
  //                                         })}
  //                                       </TableRow>
  //                                     )
  //                                   );
  //                                 })()}
  //                               </TableBody>
  //                             </Table>
  //                           </Box>
  //                         </Collapse>
  //                       </TableCell>
  //                     </TableRow>
  //                   )}
  //                 </React.Fragment>
  //               ))}
  //             </TableBody>
  //           </Table>
  //         </TableContainer>

  //         <TablePagination
  //           component="div"
  //           count={table.getFilteredRowModel().rows.length}
  //           page={pagination.pageIndex}
  //           onPageChange={(_, newPage) => {
  //             table.setPageIndex(newPage);
  //           }}
  //           rowsPerPage={pagination.pageSize}
  //           onRowsPerPageChange={(event) => {
  //             table.setPageSize(Number(event.target.value));
  //           }}
  //           rowsPerPageOptions={[10, 25, 30, 50, 100]}
  //         />
  //       </Grid>
  //     </Grid>
  //   </Box>
  // );
// };



