import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { OtCodeBlock } from "ui";
import DownloadsSchemaBuilder from "./DownloadsSchemaBuilder";
import { DownloadsContext } from "./context/DownloadsContext";

function DownloadsSchemaDialog({ children, currentRowId }) {
  const [open, setOpen] = useState(false);
  const { state } = useContext(DownloadsContext);

  const schemaRow = useMemo(
    () => state.schemaRows.filter(e => e["@id"] === currentRowId.replace("-fileset", "")),
    [currentRowId]
  );

  if (!currentRowId || !schemaRow) return children;

  const handleClickOpen = () => () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <span onClick={handleClickOpen()}>{children}</span>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            Schema: {schemaRow[0]["@id"]}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box tabIndex={-1}>
            <OtCodeBlock>
              <DownloadsSchemaBuilder data={schemaRow[0]} />
            </OtCodeBlock>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          {/* <Button onClick={handleClose}>also close</Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
}
export default DownloadsSchemaDialog;
