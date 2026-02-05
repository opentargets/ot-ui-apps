import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";
import { Link } from "ui";
import { setModalOpen } from "./actions";
import AnalysisContainer from "./components/AnalysisContainer";
import { useGeneEnrichment } from "./Provider";

interface GeneEnrichmentAnalysisModalProps {
  children?: ReactNode;
}

function GeneEnrichmentAnalysisModal({ children }: GeneEnrichmentAnalysisModalProps) {
  const [state, dispatch] = useGeneEnrichment();

  const handleClose = () => {
    dispatch(setModalOpen(false));
  };

  // Check if we have results to show (active run with complete status)
  const activeRun = state.activeRunId
    ? state.runs.find((run) => run.id === state.activeRunId)
    : null;
  const hasResults = activeRun?.status === "complete" && activeRun.results.length > 0;

  return (
    <Dialog
      onClose={handleClose}
      open={state.modalOpen}
      maxWidth={hasResults ? false : "md"}
      fullWidth
      sx={{
        ".MuiDialog-paper": {
          minWidth: hasResults ? "90vw" : "800px",
          maxWidth: hasResults ? "95vw" : undefined,
          height: hasResults ? "90vh" : "auto",
          borderRadius: (theme) => `${theme.spacing(1)} !important`,
        },
      }}
    >
      <DialogTitle
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 2 }}
      >
        Gene Set Enrichment Analysis (GSEA)
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: "text.secondary",
            "&:hover": { color: "text.primary" },
          }}
          aria-label="Close modal"
        >
          <FontAwesomeIcon icon={faXmark} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography
          sx={{ m: (theme) => `${theme.spacing(1)} 0 ${theme.spacing(4)} 0` }}
          variant="subtitle2"
          gutterBottom
        >
          Identifying overrepresented biological pathways and functional categories in ranked lists of disease-associated genes.
          <br />
          <Link
            to="https://platform-docs.opentargets.org/web-interface/associations-on-the-fly#upload-functionality"
            external
          >
            Read more details here.
          </Link>
        </Typography>
        {children || <AnalysisContainer />}
      </DialogContent>
      <DialogActions>
        {/* You could add dialog action buttons here if needed, or leave blank for now */}
      </DialogActions>
    </Dialog>
  );
}

export default GeneEnrichmentAnalysisModal;
