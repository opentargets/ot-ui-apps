import {
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  PaginationState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import useRowInteractors from "./useRowInteractors";
import useAotfContext from "../../hooks/useAotfContext";
import TableBody from "../Table/TableBody";
import { Box, Button, InputLabel, NativeSelect, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import {
  FocusActionType,
  useAssociationsFocusDispatch,
} from "../../context/AssociationsFocusContext";

const btnStyles = {
  width: "18px",
  height: "18px",
  padding: "2px",
  display: "flex",
  cursor: "pointer",
  borderRadius: "50%",
  alignItems: "center",
  justifyContent: "center",
  background: grey[400],
  "&:hover": {
    background: grey[500],
  },
};

function RowLine() {
  return (
    <Box
      sx={{
        left: "10px",
        width: "30px",
        bottom: "20px",
        height: "6000px",
        position: "absolute",
        background: "transparent",
        borderLeft: 1.5,
        borderBottom: 1.5,
        borderColor: grey[300],
      }}
    ></Box>
  );
}

function RowInteractorsTable({ row, columns, nameProperty, parentTable }) {
  const {
    id: diseaseId,
    sorting,
    enableIndirect,
    dataSourcesWeights,
    dataSourcesRequired,
    entityToGet,
    handleSetInteractors,
  } = useAotfContext();

  const dispatch = useAssociationsFocusDispatch();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const label = row.original[entityToGet][nameProperty];

  const source = "intact";

  const onClickCloseInteractors = () => {
    dispatch({
      type: FocusActionType.SET_INTERACTORS_OFF,
      focus: { row: row.id, table: parentTable },
    });
  };

  const { data, loading, interactorsMetadata } = useRowInteractors({
    options: {
      id: row.id,
      index: 0,
      size: 10,
      filter: "",
      source,
      aggregationFilters: [],
      enableIndirect,
      datasources: dataSourcesWeights,
      dataSourcesRequired,
      rowsFilter: [],
      entityInteractors: null,
      entity: "disease",
      diseaseId,
      sortBy: sorting[0].id,
    },
  });

  const interactorsTable = useReactTable({
    data: data,
    columns,
    state: {
      sorting,
      pagination,
      loading,
      prefix: "interactors",
      parentTable,
      parentRow: row.id,
    },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getRowId: row => row[entityToGet].id,
  });

  const cols = interactorsTable.getHeaderGroups()[0].headers[1].subHeaders;

  return (
    <Box sx={{ pb: 2, background: grey[100], position: "relative" }}>
      <Box sx={{ position: "relative", pt: 1 }}>
        <RowLine />
        <Box
          sx={{
            background: grey[300],
            borderColor: grey[400],
            boxSizing: "border-box",
            px: 2,
            py: 0.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            ml: 5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box onClick={() => onClickCloseInteractors()} sx={btnStyles}>
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
                  p: 0,
                  ".MuiNativeSelect-select": { border: 0 },
                }}
              >
                <option value={"intact"}>IntAct</option>
                <option value={"signor"}>Signor</option>
                <option value={"reactome"}>Reactome</option>
                <option value={"string"}>String</option>
              </NativeSelect>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              onClick={() => interactorsTable.previousPage()}
              disabled={!interactorsTable.getCanPreviousPage()}
            >
              <FontAwesomeIcon icon={faChevronLeft} size="sm" />
            </Button>
            <Button
              onClick={() => interactorsTable.nextPage()}
              disabled={!interactorsTable.getCanNextPage()}
            >
              <FontAwesomeIcon icon={faChevronRight} size="sm" />
            </Button>
          </Box>
        </Box>
      </Box>
      <Box>
        <TableBody noInteractors core={interactorsTable} cols={cols} />
      </Box>
    </Box>
  );
}
export default RowInteractorsTable;
