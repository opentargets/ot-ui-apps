import { useQuery } from "@apollo/client";
import { SectionItem, OtTable, Link, Tooltip } from "ui";
import { naLabel } from "@ot/constants";
import { Box, Button, Grid, Typography } from "@mui/material";
import Description from "./Description";
import { definition } from ".";

// import { schemeSet1, schemeDark2 } from "d3";
import OVERLAPPING_VARIANTS_QUERY from "./OverlappingVariantsQuery.gql";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { StateProvider, useStateValue, useActions } from "./Context";
import Filters from "./Filters";

// !! IMPORT ALPHAFOLD CONFIDENCE STUFF AND LEGEND  FROM UI MERGED FROM OTHER BRANCH !!
const alphaFoldConfidenceBands = [
  { lowerLimit: 90, label: "Very high", sublabel: "pLDDT > 90", color: "rgb(0, 83, 214)" },
  {
    lowerLimit: 70,
    label: "Confident",
    sublabel: "90 > pLDDT > 70",
    color: "rgb(101, 203, 243)",
  },
  { lowerLimit: 50, label: "Low", sublabel: "70 > pLDDT > 50", color: "rgb(255, 219, 19)" },
  { lowerLimit: 0, label: "Very low ", sublabel: "pLDDT < 50", color: "rgb(255, 125, 69)" },
];
function getAlphaFoldConfidence(atom, propertyName = "label") {
  for (const obj of alphaFoldConfidenceBands) {
    if (atom.b > obj.lowerLimit) return obj[propertyName];
  }
  return alphaFoldConfidenceBands[0][propertyName];
}
function AlphaFoldLegend() {
  return (
    <Box mt={2} display="flex">
      <Box display="flex" flexDirection="column" ml={2} gap={0.75}>
        <Typography variant="subtitle2">Model Confidence</Typography>
        <Box display="flex" gap={3.5}>
          {alphaFoldConfidenceBands.map(({ label, sublabel, color }) => (
            <Box key={label}>
              <Box display="flex" gap={0.75} alignItems="center">
                <Box width="12px" height="12px" bgcolor={color} />
                <Box display="flex" flexDirection="column">
                  <Typography variant="caption" fontWeight={500} lineHeight={1}>
                    {label}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" fontSize={11.5} lineHeight={1}>
                {sublabel}
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="caption" mt={1}>
          AlphaFold produces a per-residue model confidence score (pLDDT) between 0 and 100. Some
          regions below 50 pLDDT may be unstructured in isolation.
        </Typography>
      </Box>
    </Box>
  );
}

function middleElement(arr) {
  return arr[Math.floor(arr.length / 2)];
}

function Body({ id: ensemblId, label: symbol, entity }) {
  // const [molViewer, setMolViewer] = useState(null);

  const variables = { ensemblId };
  const request = useQuery(OVERLAPPING_VARIANTS_QUERY, {
    variables,
  });

  const gqlData = request?.data?.target;
  console.log(gqlData);
  const proteinCodingCoordinates = gqlData?.proteinCodingCoordinates;
  const variantsByStartingPosition = Map.groupBy(
    proteinCodingCoordinates?.rows ?? [],
    row => row.aminoAcidPosition
  );

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      request={request}
      renderDescription={() => <Description symbol={symbol} />}
      renderBody={() => {
        if (!request?.data?.target) return <></>;
        return (
          <StateProvider data={gqlData}>
            <Filters />
            <div id="Viewer"></div>
            <table></table>
          </StateProvider>
        );
      }}
    />
  );
}

export default Body;
