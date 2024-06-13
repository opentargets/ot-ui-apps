import { ReactElement } from "react";
import useAotfContext from "../../hooks/useAotfContext";
import { Box } from "@mui/material";

function RowInteractorsWrapper({ rowId, children }: { rowId: string; children: ReactElement }) {
  const { state } = useAotfContext();
  if (!state.interactors.has(rowId)) return null;

  return <Box sx={{ my: 1 }}>{children}</Box>;
}

export default RowInteractorsWrapper;
