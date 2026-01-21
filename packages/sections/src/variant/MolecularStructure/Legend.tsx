import { Box, Typography } from "@mui/material";
import {
  CompactAlphaFoldLegend,
  CompactAlphaFoldPathogenicityLegend,
  CompactAlphaFoldDomainLegend,
  CompactAlphaFoldHydrophobicityLegend,
  useViewerState
} from "ui";
import { domainColors, hydrophobicityColorInterpolator } from "ui/src/components/Viewer/helpers";

function Legend() {

  const viewerState = useViewerState();
  const  { colorBy, pathogenicityScores, domains } = viewerState;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      {/* explanatory text */}
      {colorBy === "pathogenicity" && pathogenicityScores && (
        <Typography variant="caption" sx={{ pl: 0.4 }}>
          Mean AlphaMissense pathogenicity over possible amino acid substitutions
        </Typography>
      )}
    
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          flexWrap: "wrap",
          ml: { xs: 1, lg: 0 },
        }}
      >
        <Box>
          {colorBy === "confidence" ? (
              <CompactAlphaFoldLegend showTitle={false} />
            ) : colorBy === "pathogenicity" && pathogenicityScores ? (
              <CompactAlphaFoldPathogenicityLegend showTitle={false} />
            ) : colorBy === "domain" && domains ? (
              <CompactAlphaFoldDomainLegend domains={domains} colorScheme={domainColors} />
            ) : colorBy === "hydrophobicity" ? (
              <CompactAlphaFoldHydrophobicityLegend colorInterpolator={hydrophobicityColorInterpolator} />
            ) : null
          }
        </Box>
      </Box>
    </Box>
  );
}

export default Legend;