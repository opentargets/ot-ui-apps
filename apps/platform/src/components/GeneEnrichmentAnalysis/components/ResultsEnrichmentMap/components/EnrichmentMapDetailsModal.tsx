import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Chip,
  Stack,
  Link as MuiLink,
  IconButton,
  Tooltip,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useApolloClient } from "@apollo/client";
import { getGeneTargetUrl, buildGeneToTargetIdMapping, buildAOTFLink, getTargetIdsFromMapping } from "../utils/geneMapping";

interface NodeData {
  id: string;
  pathway?: string;
  link?: string;
  nes?: number;
  fdr?: number;
  pValue?: number;
  pathwaySize?: number;
  geneCount?: number;
  displayLabel?: string;
}

interface EdgeData {
  id: string;
  source?: string;
  target?: string;
  sourceName?: string;
  targetName?: string;
  sourceLink?: string;
  targetLink?: string;
  sharedCount?: number;
  sharedGenes?: string[];
  jaccardCoefficient?: number;
}

interface EnrichmentMapDetailsModalProps {
  open: boolean;
  type: "node" | "edge" | null;
  data: NodeData | EdgeData | null;
  onClose: () => void;
  diseaseId?: string; // Optional disease ID for AOTF links
}

/**
 * Node Details Content Component
 */
function NodeDetailsContent({ data }: { data: NodeData }) {
  return (
    <>
      <Box>
        <Typography variant="subtitle2" fontWeight={600}>
          Pathway Name
        </Typography>
        {data.link ? (
          <MuiLink href={data.link} target="_blank" rel="noopener noreferrer" variant="body2">
            {data.pathway}
          </MuiLink>
        ) : (
          <Typography variant="body2">{data.pathway}</Typography>
        )}
      </Box>

      <Divider />

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            NES Score
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {(data.nes as number)?.toFixed(3)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            FDR p-value
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {(data.fdr as number)?.toExponential(2)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            p-value
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {(data.pValue as number)?.toExponential(2)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Pathway Size
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {data.pathwaySize}
          </Typography>
        </Box>
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary">
          Leading Edge Genes
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          {data.geneCount}
        </Typography>
      </Box>
    </>
  );
}

/**
 * Edge Details Content Component
 */
function EdgeDetailsContent({
  data,
  geneToTargetIdMapping,
  diseaseId,
}: {
  data: EdgeData;
  geneToTargetIdMapping?: Map<string, string>;
  diseaseId?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyGenes = async () => {
    const geneText = (data.sharedGenes || []).join("\n");
    try {
      await navigator.clipboard.writeText(geneText);
      setCopied(true);
      // Reset the icon after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("[COPY_GENES] Failed to copy to clipboard:", err);
    }
  };

  const handleViewInAOTF = () => {
    const targetIds = getTargetIdsFromMapping(data.sharedGenes || [], geneToTargetIdMapping || new Map());
    const aotfLink = buildAOTFLink(diseaseId || "", targetIds);
    window.open(aotfLink, "_blank");
  };
  return (
    <>
      <Box>
        <Typography variant="subtitle2" fontWeight={600}>
          Connected Pathways
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: "center" }}>
          <Box sx={{ flex: 1 }}>
            {data.sourceLink ? (
              <MuiLink href={data.sourceLink} target="_blank" rel="noopener noreferrer">
                {data.sourceName || data.source}
              </MuiLink>
            ) : (
              <Typography variant="body2">{data.sourceName || data.source}</Typography>
            )}
          </Box>
          <Typography variant="body2" sx={{ mx: 0.5 }}>
            →
          </Typography>
          <Box sx={{ flex: 1 }}>
            {data.targetLink ? (
              <MuiLink href={data.targetLink} target="_blank" rel="noopener noreferrer">
                {data.targetName || data.target}
              </MuiLink>
            ) : (
              <Typography variant="body2">{data.targetName || data.target}</Typography>
            )}
          </Box>
        </Stack>
      </Box>

      <Divider />

      <Box>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Shared Genes: {data.sharedCount}
          </Typography>
          <Tooltip title={copied ? "Copied!" : "Copy all genes"}>
            <IconButton
              size="small"
              onClick={handleCopyGenes}
              sx={{
                p: 0.5,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              {copied ? (
                <FontAwesomeIcon
                  icon={faCheck}
                  style={{
                    fontSize: "12px",
                    color: "#4caf50",
                    fontWeight: "bold",
                  }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCopy}
                  style={{
                    fontSize: "12px",
                    color: "#1976d2",
                  }}
                />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
        <Box
          sx={{
            mt: 1,
            p: 1.5,
            bgcolor: "#f5f5f5",
            borderRadius: 1,
            maxHeight: 200,
            overflow: "auto",
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {(data.sharedGenes || []).map((gene, idx) => {
              const targetUrl = getGeneTargetUrl(gene, geneToTargetIdMapping || new Map());
              return (
                <MuiLink
                  key={`${gene}-${idx}`}
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  <Chip
                    label={gene}
                    size="small"
                    component="span"
                    sx={{
                      "&:hover": {
                        backgroundColor: "#e0e0e0",
                        cursor: "pointer",
                      },
                    }}
                  />
                </MuiLink>
              );
            })}
          </Box>
        </Box>
        {diseaseId && (
          <Button
            onClick={handleViewInAOTF}
            size="small"
            variant="outlined"
            sx={{ mt: 1 }}
          >
            View genes in AOTF page
          </Button>
        )}
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary">
          Jaccard Similarity
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          {(data.jaccardCoefficient as number)?.toFixed(3)}
        </Typography>
      </Box>
    </>
  );
}

/**
 * Main Modal Component
 */
export function EnrichmentMapDetailsModal({
  open,
  type,
  data,
  onClose,
  diseaseId,
}: EnrichmentMapDetailsModalProps) {
  const apolloClient = useApolloClient();
  const [geneToTargetIdMapping, setGeneToTargetIdMapping] = useState<Map<string, string>>(
    new Map()
  );

  // Lazy-load gene mapping when modal opens with edge data
  useEffect(() => {
    if (!open || type !== "edge" || !data || !(data as EdgeData).sharedGenes) {
      return;
    }

    const buildMapping = async () => {
      if (!apolloClient) return;
      const sharedGenes = (data as EdgeData).sharedGenes || [];
      const mapping = await buildGeneToTargetIdMapping(apolloClient, sharedGenes);
      setGeneToTargetIdMapping(mapping);
    };

    buildMapping();
  }, [open, type, data, apolloClient]);

  if (!data) return null;

  const isNode = type === "node";
  const isEdge = type === "edge";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isNode ? "Pathway Details" : "Connection Details"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          {isNode && (data as NodeData).pathway && (
            <NodeDetailsContent data={data as NodeData} />
          )}

          {isEdge && (data as EdgeData).sharedGenes && (
            <EdgeDetailsContent
              data={data as EdgeData}
              geneToTargetIdMapping={geneToTargetIdMapping}
              diseaseId={diseaseId}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
