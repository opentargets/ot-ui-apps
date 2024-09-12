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
import { Box, Button, InputLabel, NativeSelect, Skeleton, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import {
  FocusActionType,
  InteractorsSource,
  useAssociationsFocus,
  useAssociationsFocusDispatch,
} from "../../context/AssociationsFocusContext";
import { ENTITIES, INTERACTORS_SOURCES, TABLE_PREFIX } from "../../utils";

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
    entityToGet,
  } = useAotfContext();

  // const label = row.original[entityToGet][nameProperty];

  const focusState = useAssociationsFocus();
  const dispatch = useAssociationsFocusDispatch();

  const focusElement = focusState.find(
    e => e.row === row.id && e.table === parentTable && e.interactors
  );

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const onClickCloseInteractors = () => {
    dispatch({
      type: FocusActionType.SET_INTERACTORS_OFF,
      focus: { row: row.id, table: parentTable },
    });
  };

  const onInteractorsSourceChange = (newSource: InteractorsSource) => {
    dispatch({
      type: FocusActionType.SET_INTERACTORS_SOURCE,
      focus: { row: row.id, table: parentTable, source: newSource },
    });
  };

  const { data, loading, interactorsMetadata } = useRowInteractors({
    options: {
      id: row.id,
      index: 0,
      size: 10,
      filter: "",
      source: focusElement?.interactorsSource,
      aggregationFilters: [],
      enableIndirect,
      datasources: dataSourcesWeights,
      rowsFilter: [],
      entityInteractors: null,
      entity: ENTITIES.DISEASE,
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
      prefix: TABLE_PREFIX.INTERACTORS,
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
            justifyContent: "space-between",
            boxSizing: "border-box",
            alignItems: "center",
            display: "flex",
            borderColor: grey[400],
            background: grey[300],
            px: 2,
            py: 0.5,
            mb: 1,
            ml: 5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box onClick={() => onClickCloseInteractors()} sx={btnStyles}>
              <FontAwesomeIcon size="sm" icon={faClose} />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: "bold", mr: 2 }}>
              Interactors
            </Typography>

            <Box display="flex" alignItems="center" gap={1}>
              <InputLabel sx={{ fontSize: "0.85rem" }} htmlFor="intaractor_data_source">
                Source:
              </InputLabel>
              <NativeSelect
                id="intaractor_data_source"
                onChange={e => {
                  onInteractorsSourceChange(e.target.value);
                }}
                variant="standard"
                value={focusElement?.interactorsSource}
                sx={{
                  fontSize: "0.85rem",
                  boxShadow: "none",
                  p: 0,
                  ".MuiNativeSelect-select": { border: 0 },
                }}
              >
                <option value={INTERACTORS_SOURCES.REACTOME}>Reactome</option>
                <option value={INTERACTORS_SOURCES.INTACT}>IntAct</option>
                <option value={INTERACTORS_SOURCES.SIGNOR}>Signor</option>
                <option value={INTERACTORS_SOURCES.STRING}>String</option>
              </NativeSelect>
            </Box>
            {loading ? (
              <Skeleton width={265} />
            ) : (
              <Typography variant="caption" sx={{ ml: 2 }}>
                <b>{data?.length}</b> association
                {data.length > 1 ? "s" : ""} found in <b>{interactorsMetadata?.count || 0}</b>{" "}
                target interactors
              </Typography>
            )}
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
