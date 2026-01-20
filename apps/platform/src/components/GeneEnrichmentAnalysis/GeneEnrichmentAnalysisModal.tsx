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
import GeneEnrichmentAnalysisForm from "./GeneEnrichmentAnalysisForm";
import { useGeneEnrichment } from "./Provider";

interface GeneEnrichmentAnalysisModalProps {
  children?: ReactNode;
}

function GeneEnrichmentAnalysisModal({ children }: GeneEnrichmentAnalysisModalProps) {
  const [state, dispatch] = useGeneEnrichment();

  const handleClose = () => {
    dispatch(setModalOpen(false));
  };

  return (
    <Dialog
      onClose={handleClose}
      open={state.modalOpen}
      sx={{
        ".MuiDialog-paper": {
          // width: "70%",
          minWidth: "800px !important",
          borderRadius: (theme) => `${theme.spacing(1)} !important`,
        },
      }}
    >
      <DialogTitle
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 2 }}
      >
        Gene Enrichment Analysis
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
          Help text
          <br />
          <Link
            to="https://platform-docs.opentargets.org/web-interface/associations-on-the-fly#upload-functionality"
            external
          >
            Read more details here.
          </Link>
        </Typography>
        {children || <GeneEnrichmentAnalysisForm />}
      </DialogContent>
      <DialogActions>
        {/* You could add dialog action buttons here if needed, or leave blank for now */}
      </DialogActions>
    </Dialog>
  );
}

export default GeneEnrichmentAnalysisModal;
