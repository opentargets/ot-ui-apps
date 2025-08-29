
import { Box, Typography } from "@mui/material";
import { useViewerState, useViewerInteractionState } from "ui";
import { getAlphaFoldPathogenicity, getAlphaFoldConfidence, naLabel } from "@ot/constants";

function AtomInfo() {
  const viewerState = useViewerState();
  const viewerInteractionState = useViewerInteractionState();
  const { hoveredResi } = viewerInteractionState;
  const {
    variantResidues,
    colorBy,
    pathogenicityScores,
    variantPathogenicityScore,
    atomsByResi,
  } = viewerState;

  if (!hoveredResi) return null;

  const resiAtom = atomsByResi.get(hoveredResi)[0];
  const onVariant = variantResidues.has(hoveredResi);

  function averagePathoText() {
    const score = pathogenicityScores.get(hoveredResi);
    return `${score.toFixed(3)} (${getAlphaFoldPathogenicity(score).toLowerCase()})`;
  };
  
  function variantPathoText() {
    return `${variantPathogenicityScore.toFixed(3)} (${
      getAlphaFoldPathogenicity(variantPathogenicityScore).toLowerCase()})`;
  };

  function Details() {
    switch(colorBy) {
      case "confidence":
        return  `Confidence: ${resiAtom.b} (${getAlphaFoldConfidence(resiAtom).toLowerCase()})`
      case "pathogenicity":
        return pathogenicityScores ? (
          <>
            Mean pathogenicity: {averagePathoText()}
            {onVariant && (
              <>
                <br />
                Variant Pathogenicity:{" "}
                {variantPathogenicityScore === null ? naLabel : variantPathoText()}
              </>
            )}
          </>
        ) : null
      case "domain": {
        const { domains } = viewerState;
        if (!domains) return null;
        const description = domains.getDescription(resiAtom.resi);
        return description ? `Domain: ${description}` : null;
      }
      default:
        return null;
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      p="0.6rem 0.8rem"
      bgcolor="#f8f8f8c8"
      sx={{ borderTopLeftRadius: "0.2rem" }}
      fontSize={14}
    >
      <Typography variant="caption" component="p" textAlign="right">
        {resiAtom.resn}{" "}{hoveredResi}
      </Typography>
      <Typography variant="caption" component="p" textAlign="right">
        <Details />
      </Typography>
    </Box>
  );
}

export default AtomInfo;