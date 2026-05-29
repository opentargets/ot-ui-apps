import { Box, Skeleton, Divider } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useGenTrackTooltipState } from "../../providers/GenTrackTooltipProvider";
import { TARGET_TOOLTIP_QUERY, VARIANT_TOOLTIP_QUERY } from "../OtAsyncTooltip/utils/asyncTooltipUtil";
import { getEntityIcon, getEntityDescription } from "../OtAsyncTooltip/utils/asyncTooltipUtil";
import { naLabel } from "@ot/constants";
import { OtGenomicLocation } from "../..";
import { GenomicLocationPresentationType } from "@ot/constants";

function UnifiedTooltip() {
  const { datum } = (useGenTrackTooltipState() ?? {}) as { datum?: any };
  const [getTargetData, targetQuery] = useLazyQuery(TARGET_TOOLTIP_QUERY);
  const [getVariantData, variantQuery] = useLazyQuery(VARIANT_TOOLTIP_QUERY);
  const [aborterRef] = useState(new AbortController());

  // Determine entity type from datum
  const entityType = datum?.approvedSymbol ? "target" : datum?.chromosome ? "variant" : null;

  // Fetch data when datum changes
  useEffect(() => {
    if (!datum?.id) return;
    
    if (entityType === "target") {
      getTargetData({
        variables: { ensgId: datum.id },
        context: { fetchOptions: { signal: aborterRef.signal } },
      });
    } else if (entityType === "variant") {
      getVariantData({
        variables: { variantId: datum.id },
        context: { fetchOptions: { signal: aborterRef.signal } },
      });
    }
    
    return () => {
      aborterRef.abort();
    };
  }, [datum?.id, entityType]);

  if (!datum) return null;

  const loading = entityType === "target" ? targetQuery.loading : variantQuery.loading;
  const data = entityType === "target" ? targetQuery.data?.target : variantQuery.data?.variant;

  // Loading state
  if (loading || !data) {
    return (
      <Box sx={{ width: 300, p: 1, backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <Box>
          <Skeleton />
          <Skeleton />
        </Box>
        <Skeleton />
        <Skeleton />
      </Box>
    );
  }

  // Render rich async tooltip content
  return (
    <Box sx={{
      p: 1,
      backgroundColor: "#fff",
      border: "1px solid #ccc",
      borderRadius: 1,
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    }}>
      <Box
        sx={{
          p: 1,
          py: 0,
          fontSize: "0.7rem",
          color: theme => theme.palette.grey[700],
          textDecoration: "underline",
        }}
      >
        {`${entityType}/${data.id}`}
      </Box>
      <Box sx={{ display: "flex", gap: 1, py: 1 }}>
        <Box sx={{ p: 1, color: theme => theme.palette.primary.main }}>
          <FontAwesomeIcon size="2x" icon={getEntityIcon(entityType || "")} />
        </Box>
        <Box sx={{ pt: 0.4, flex: 1 }}>
          <Box
            sx={{
              typography: "subtitle2",
              color: theme => theme.palette.grey[900],
              textTransform: "capitalize",
              fontWeight: "bold",
            }}
          >
            {data.name || data.id || naLabel}
          </Box>
          <Box sx={{ typography: "body2", color: theme => theme.palette.grey[800] }}>
            {getEntityDescription(entityType || "", data as Record<string, unknown>)}
          </Box>
        </Box>
      </Box>
      {entityType === "target" && data.genomicLocation?.chromosome && (
        <Box sx={{ mt: 1, px: 1, typography: "body2" }} component="span">
          <Divider />
          <OtGenomicLocation
            type={GenomicLocationPresentationType.PLAIN}
            geneLoc={data.genomicLocation}
          />
        </Box>
      )}
    </Box>
  );
}

export default UnifiedTooltip;
