import { useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import AssocTooltip from "./AssocTooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { gql, useQuery } from "@apollo/client";
import useAotfContext from "../../hooks/useAotfContext";

const NOVELTY_DETAIL_QUERY = gql`
  query NoveltyDetail($targetId: String!, $diseaseId: String!) {
    target(ensemblId: $targetId) {
      id
      approvedSymbol
      approvedName
    }
    disease(efoId: $diseaseId) {
      id
      name
    }
  }
`;

type NoveltyDetailPanelProps = {
  row: Record<string, unknown>;
  onClose: () => void;
};

function NoveltyDetailPanel({ row, onClose }: NoveltyDetailPanelProps) {
  const { id: parentEntityId, entity } = useAotfContext();
  const isTargetPage = entity === "target";
  const targetId = isTargetPage ? parentEntityId : (row.target as any)?.id;
  const diseaseId = isTargetPage ? (row.disease as any)?.id : parentEntityId;

  const { data, loading, error } = useQuery(NOVELTY_DETAIL_QUERY, {
    variables: { targetId, diseaseId },
    skip: !targetId || !diseaseId,
  });

  return (
    <>
      <DialogTitle sx={{ pr: 6 }}>
        Novelty detail
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
          size="small"
          aria-label="close"
        >
          <FontAwesomeIcon icon={faXmark} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        )}
        {error && (
          <Typography color="error" variant="body2">
            Failed to load: {error.message}
          </Typography>
        )}
        {data && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Target
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {data.target.approvedSymbol}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.target.approvedName}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Disease
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {data.disease.name}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Novelty score
              </Typography>
              <Typography variant="h4">
                {row.novelty != null ? (row.novelty as number).toFixed(3) : "—"}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
    </>
  );
}

type NoveltyGaugeProps = {
  value: number | null | undefined;
};

function NoveltyGauge({ value }: NoveltyGaugeProps) {
  if (value == null) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "text.disabled", fontSize: 12 }}>
        —
      </Box>
    );
  }

  const pct = Math.max(0, Math.min(1, value)) * 100;

  return (
    <AssocTooltip title={`Score: ${value.toFixed(2)}`} arrow placement="top">
      <Box sx={{ px: 0.75, height: "100%", display: "flex", alignItems: "center" }}>
        <Box sx={{ position: "relative", width: "100%", height: 20 }}>
          {/* Track */}
          <Box sx={{
            position: "absolute",
            top: 14,
            left: 0,
            right: 0,
            height: 2,
            bgcolor: "#d8d8d8",
            borderRadius: "1px",
          }} />
          {/* Tick */}
          <Box sx={{
            position: "absolute",
            top: 6,
            left: `${pct}%`,
            transform: "translateX(-50%)",
            width: 3,
            height: 12,
            bgcolor: "primary.dark",
            borderRadius: "1px",
          }} />
        </Box>
      </Box>
    </AssocTooltip>
  );
}

type NoveltyGaugeCellProps = {
  value: number | null | undefined;
  row: Record<string, unknown>;
};

export function NoveltyGaugeCell({ value, row }: NoveltyGaugeCellProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        onClick={() => setOpen(true)}
        sx={{ cursor: "pointer", height: "100%", width: "100%" }}
      >
        <NoveltyGauge value={value} />
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <NoveltyDetailPanel row={row} onClose={() => setOpen(false)} />
      </Dialog>
    </>
  );
}
