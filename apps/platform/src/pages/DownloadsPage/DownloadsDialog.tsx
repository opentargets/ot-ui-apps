import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useMemo } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";

import DownloadsSchema from "./DownloadsSchema";

function DownloadsDialog({ currentRowId }) {
  const navigate = useNavigate();
  const { downloadsRow } = useParams();

  const open = useMemo(() => downloadsRow === currentRowId.replace("-fileset", ""), [currentRowId]);

  const handleClose = () => {
    navigate("/downloads");
  };

  return (
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
          Dataset: {currentRowId.replace("-fileset", "")}
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, pt: 2, mx: 3, mb: 3 }}>
        <Routes>
          <Route path="schema" element={<DownloadsSchema currentRowId={currentRowId} />} />
        </Routes>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
export default DownloadsDialog;
