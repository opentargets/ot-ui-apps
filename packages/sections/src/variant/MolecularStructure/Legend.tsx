import { Box, Typography } from "@mui/material";
import {
  CompactAlphaFoldLegend,
  CompactAlphaFoldPathogenicityLegend,
  useViewerState
} from "ui";

function Legend() {

  const viewerState = useViewerState();
  const  {
    colorBy,
    variantResidues,
    pathogenicityScores,
    variantPathogenicityScore
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
                <strong>Backbone:</strong>
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
                  AlphaMissense pathogenicity for the substitution corresponding to the variant
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
        {(colorBy === "confidence") && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              gap: 0.75,
              pr: 3,
            }}
          >
            <Typography variant="caption" lineHeight={1}>
              Reference amino acid{variantResidues.size > 1 ? "s" : ""}
            </Typography>
            <Box
              sx={{ width: "11px", height: "11px", borderRadius: "5.5px", bgcolor: "#0d0" }}
            />
          </Box>
        )}
        <Box>
          {colorBy === "confidence" ? (
              <CompactAlphaFoldLegend showTitle={false} />
            ) : colorBy === "pathogenicity" && pathogenicityScores ? (
              <CompactAlphaFoldPathogenicityLegend showTitle={false} />
            ) : null
          }
        </Box>
      </Box>
    </Box>
  );
}

export default Legend;