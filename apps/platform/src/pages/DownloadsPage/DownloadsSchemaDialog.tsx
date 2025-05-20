import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              maxWidth: "80%",
              maxHeight: "90%",
            },
          },
        }}
      >
        <DialogTitle id="scroll-dialog-title">
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            Schema: {schemaRow[0]["@id"]}
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, pt: 2, mx: 3, mb: 3 }}>
          <Box tabIndex={-1} sx={{ typography: "subtitle2" }}>
            <OtCodeBlock removePadding>
              <DownloadsSchemaBuilder data={schemaRow[0]} />
            </OtCodeBlock>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default DownloadsSchemaDialog;
