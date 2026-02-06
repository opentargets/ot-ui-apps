import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
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

  return (
    <Dialog
      onClose={handleClose}
      open={state.modalOpen}
      maxWidth={false}
      fullWidth
      disableScrollLock={false}
      sx={{
        ".MuiDialog-paper": {
          width: "85vw",
          maxWidth: "95vw",
          height: "90vh",
          borderRadius: (theme) => `${theme.spacing(1)} !important`,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
          px: 3,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box>Gene Enrichment Analysis</Box>
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
      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>
        <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            Identify enriched biological pathways from your gene associations using Gene Set
            Enrichment Analysis (GSEA).{" "}
            <Link
              to="https://platform-docs.opentargets.org/web-interface/associations-on-the-fly#upload-functionality"
              external
            >
              Read more details here.
            </Link>
          </Typography>
        </Box>
        {children || <AnalysisContainer />}
      </DialogContent>
    </Dialog>
  );
}

export default GeneEnrichmentAnalysisModal;
