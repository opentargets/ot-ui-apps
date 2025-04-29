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
import React from "react";
import { OtCodeBlock } from "ui";
import DownloadsSchemaBuilder from "./DownloadsSchemaBuilder";

function DownloadsSchemaDialog({ children, schemaRow }) {
  const [open, setOpen] = React.useState(false);

  if (!schemaRow) return children;

  const handleClickOpen = () => () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
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
        <ToggleButtonGroup size="small" aria-label="Small sizes">
          <ToggleButton value="schema" key="schema">
            schema
          </ToggleButton>
          <ToggleButton value="table" key="table">
            table
          </ToggleButton>
          ,
        </ToggleButtonGroup>
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
    </React.Fragment>
  );
}
export default DownloadsSchemaDialog;
