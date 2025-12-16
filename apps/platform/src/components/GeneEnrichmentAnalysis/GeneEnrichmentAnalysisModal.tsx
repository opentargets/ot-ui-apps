import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import type { ReactNode } from "react";
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
    <Modal open={state.modalOpen} onClose={handleClose} disableAutoFocus>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 1000,
          height: "90vh",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" component="h2" fontWeight={500} color="secondary.main">
            Gene Enrichment Analysis
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "text.primary",
              },
            }}
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faXmark} />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflow: "auto" }}>{children || <GeneEnrichmentAnalysisForm />}</Box>
      </Box>
    </Modal>
  );
}

export default GeneEnrichmentAnalysisModal;
