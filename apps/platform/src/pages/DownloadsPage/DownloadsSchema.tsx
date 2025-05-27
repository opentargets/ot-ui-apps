import { Box } from "@mui/material";
import { useContext, useMemo } from "react";
import { OtCodeBlock } from "ui";
import DownloadsSchemaBuilder from "./DownloadsSchemaBuilder";
import { DownloadsContext } from "./context/DownloadsContext";

function DownloadsSchema({ currentRowId }) {
  const { state } = useContext(DownloadsContext);

  const schemaRow = useMemo(
    () => state.schemaRows.filter(e => e["@id"] === currentRowId.replace("-fileset", "")),
    [currentRowId]
  );

  if (!currentRowId || !schemaRow) return <></>;

  return (
    <Box tabIndex={-1} sx={{ typography: "subtitle2" }}>
      <OtCodeBlock>
        <DownloadsSchemaBuilder data={schemaRow[0]} />
      </OtCodeBlock>
    </Box>
  );
}
export default DownloadsSchema;
