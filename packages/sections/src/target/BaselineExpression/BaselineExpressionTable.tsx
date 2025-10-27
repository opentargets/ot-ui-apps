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

  console.log({ firstLevel, secondLevel, thirdLevel });
  return { firstLevel, secondLevel, thirdLevel };
}

const BaselineExpressionTable: React.FC<BaselineExpressionTableProps> = ({
  data,
  DownloaderComponent,
}) => {

  // const classes = useStyles();
  // const [sorting, setSorting] = useState<SortingState>([]);
  // const [pagination, setPagination] = useState<PaginationState>({
  //   pageIndex: 0,
  //   pageSize: 30,
  // });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [groupByTissue, setGroupByTissue] = useState(true);
  // const [searchTerm, setSearchTerm] = useState("");

  const { firstLevel, secondLevel, thirdLevel } = useMemo(() => prepareData(data, true), [data, groupByTissue]); // groupByTissue));


  const getRowCanExpand = useCallback((row) => {
    return true; // !! NEED TO ACTUALLY ONLY MAKE THIS TRUE IF CAN BE EXPANDED - ALWAYS FOR 1ST->2ND LEVEL ANYWAY?
  }, []);

  const getSubRows = useCallback((row) => {
    return secondLevel[row._firstLevelId] ?? [];
    // return row._firsLevelId
    //   ? (secondLevel[row._firstLevelId] ?? [])
    //   : (thirdLevel[row._secondLevelName] ?? []);
  }, [secondLevel]);

  const getName = useCallback((obj) => {
    const dataRow = obj["scrna-seq"] ?? obj["bulk rna-seq"] ?? obj["mass-spectrometry proteomics"];
    return dataRow._secondLevelName ?? dataRow._firstLevelName;
  }, [groupByTissue]);

  const columns = [
    columnHelper.display({
      id: 'expander',
      header: () => null,
      cell: ({ row }) => (
        row.getCanExpand() ? (
          <button
            onClick={row.getToggleExpandedHandler()}
            className="text-blue-600"
          >
            {row.getIsExpanded() ? '▼' : '▶'}
          </button>
        ) : null
      ),
    }),
    columnHelper.accessor(
      row => getName(row), {
      header: groupByTissue ? "Tissue" : "Cell Type",
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
    data: firstLevel,
    columns,
    getRowCanExpand,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows,
    state: {
    //   sorting,
    //   pagination,
      expanded,
    },
    // onSortingChange: setSorting,
    // onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
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
            <Fragment key={row.id}>
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>

              {/* 3rd level rows */}
              {row.getIsExpanded() && row.original._secondLevelName && (
                <tr>
                  <td colSpan={row.getAllCells().length}>
                    {/* {console.log(thirdLevel[row._secondLevelName]), JSON.stringify(thirdLevel[row._secondLevelName])}  */}
                    {console.log(thirdLevel[row.original._secondLevelName]), JSON.stringify(thirdLevel[row.original._secondLevelName].map(r => `${r.celltypeBiosampleFromSource}: ${r.median.toFixed(2)}`))} 
                  </td>
                </tr>
              )}
              {/* {row.getIsExpanded() && (
                <tr>
                  <td colSpan={row.getAllCells().length}>
                  </td>
                </tr>
              )} */}
            </Fragment>
          ))}
        </tbody>
        {/* <tfoot>
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
        </tfoot> */}
      </table>
    </Box>
  );

}

export default BaselineExpressionTable;