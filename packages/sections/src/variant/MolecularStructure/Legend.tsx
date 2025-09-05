import { Box, Typography } from "@mui/material";
import {
  CompactAlphaFoldLegend,
  CompactAlphaFoldPathogenicityLegend,
  CompactAlphaFoldDomainLegend,
  CompactAlphaFoldHydrophobicityLegend,
  useViewerState
} from "ui";
import { domainColors, hydrophobicityColorInterpolator } from "./helpers";

function Legend() {

  const viewerState = useViewerState();
  const  {
    colorBy,
    pathogenicityScores,
    variantPathogenicityScore,
    domains,
  } = viewerState;

  return (
    <Box>
      {/* explanatory text */}
      {colorBy === "pathogenicity" && pathogenicityScores && (
        <Box
          component="table"
          sx={{
            display: "flex",
            justifyContent: "end",
            ml: { xs: 1, lg: 0 },
            borderCollapse: "separate",
            borderSpacing: "0",
            mb: 0.2,
          }}
        >
          <tbody>
            <tr>
              <Typography component="td" variant="caption" textAlign="right">
                <strong>Structure:</strong>
              </Typography>
              <Typography component="td" variant="caption" sx={{ pl: 0.4 }}>
                mean AlphaMissense pathogenicity over possible amino acid substitutions
              </Typography>
            </tr>
            {variantPathogenicityScore && (
              <tr>
                <Typography component="td" variant="caption" textAlign="right">
                  <strong>Variant:</strong>
                </Typography>
                <Typography component="td" variant="caption" sx={{ pl: 0.4 }}>
                  AlphaMissense pathogenicity for substitution corresponding to variant
                </Typography>
              </tr>
            )}
          </tbody>
        </Box>
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