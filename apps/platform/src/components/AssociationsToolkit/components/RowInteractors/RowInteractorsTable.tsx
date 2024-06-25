import { getCoreRowModel, getExpandedRowModel, useReactTable } from "@tanstack/react-table";
import useRowInteractors from "./useRowInteractors";
import useInteractors from "./useInteractors";
import useAotfContext from "../../hooks/useAotfContext";
import TableBody from "../Table/TableBody";
import { Box, InputLabel, NativeSelect, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

const btnStyles = {
  cursor: "pointer",
  background: grey[400],
  padding: "2px",
  borderRadius: "50%",
  height: "18px",
  width: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    background: grey[500],
  },
};

function RowInteractorsTable({ row, columns, rowNameEntity }: { rowId: string }) {
  const {
    id: diseaseId,
    state,
    sorting,
    enableIndirect,
    dataSourcesWeights,
    dataSourcesRequired,
    entityToGet,
    handleSetInteractors,
    handleDisableInteractors,
  } = useAotfContext();

  const label = row.original[entityToGet][rowNameEntity];

  const source: string = state.interactors.get(row.id)[0];

  const { visibleData, visibleLoading, prevPage, nextPage } = useInteractors(row.id, source);
  useEffect(() => {
    console.log(visibleData);
  }, [visibleData]);

  // const { data, loading, error, count } = useRowInteractors({
  //   options: {
  //     id: row.id,
  //     index: 0,
  //     size: 10,
  //     filter: "",
  //     source,
  //     aggregationFilters: [],
  //     enableIndirect,
  //     datasources: dataSourcesWeights,
  //     dataSourcesRequired,
  //     rowsFilter: [],
  //     entityInteractors: null,
  //     entity: "disease",
  //     diseaseId,
  //     sortBy: sorting[0].id,
  //   },
  // });

  const interactorsTable = useReactTable({
    data: visibleData,
    columns,
    pageCount: visibleData.length,
    state: {
      sorting,
      loading: visibleLoading,
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: row => row[entityToGet].id,
    manualSorting: true,
  });
  const cols = interactorsTable.getHeaderGroups()[0].headers[1].subHeaders;
  return (
    <>
      <Box
        sx={{
          background: grey[300],
          borderRadius: `4px 4px 0 0`,
          boxSizing: "border-box",
          px: 2,
          py: 0.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box onClick={() => handleDisableInteractors(row.id)} sx={btnStyles}>
            <FontAwesomeIcon size="sm" icon={faClose} />
          </Box>
          <Typography variant="body2" sx={{ fontWeight: "bold", mr: 2 }}>
            {label} interactors
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <InputLabel sx={{ fontSize: "0.85rem" }} htmlFor="intaractor_data_source">
              Source:
            </InputLabel>
            <NativeSelect
              id="intaractor_data_source"
              onChange={e => {
                handleSetInteractors(row.id, e.target.value);
              }}
              variant="standard"
              value={source}
              sx={{
                fontSize: "0.85rem",
                boxShadow: "none",

                ".MuiNativeSelect-select": { border: 0 },
                p: 0,
              }}
            >
              <option value={"intact"}>IntAct</option>
              <option value={"signor"}>Signor</option>
              <option value={"reactome"}>Reactome</option>
              <option value={"string"}>String</option>
            </NativeSelect>
          </Box>
          {/* <Typography variant="body2" sx={{ fontWeight: "bold", mr: 2 }}>
            {count} interactors
            </Typography> */}
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box onClick={() => prevPage()} sx={{ cursor: "pointer" }}>
            <FontAwesomeIcon icon={faChevronLeft} size="sm" />
          </Box>
          <Box onClick={() => nextPage()} sx={{ cursor: "pointer" }}>
            <FontAwesomeIcon icon={faChevronRight} size="sm" />
          </Box>
        </Box>
      </Box>
      <Box sx={{ border: 1, borderColor: grey[300] }}>
        <TableBody noInteractors core={interactorsTable} cols={cols} />
      </Box>
    </>
  );
}
export default RowInteractorsTable;
