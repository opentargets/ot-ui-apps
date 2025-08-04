import { Box } from "@mui/material";
import {
  Viewer,
  useViewerDispatch,
  useViewerInteractionState,
  useViewerInteractionDispatch,
} from "ui";
import {
  alphaFoldCifUrl,
  fetchPathogenicityScores,
  meanPathogenicityScores,
  pickPathogenicityScore, 
  safeFetch,
} from "@ot/utils";
import { useEffect, useState } from "react";
import {
  dataHandler,
  drawAppearance,
  hoverAppearance,
  clickAppearance,
  trackColor,
} from "./helpers";

function StructureViewer({ row }) {
  const viewerDispatch = useViewerDispatch();
  const viewerInteractionState = useViewerInteractionState();
  const viewerInteractionDispatch = useViewerInteractionDispatch();
  const [structureData, setStructureData] = useState(null);
  const [uniprotId, setUniprotId] = useState(null);

  // fetch AlphaFold structure - try uniprot ids until successful
  useEffect(() => {
    if (!row) return;
    async function fetchStructure() {
      let _uniprotId, _structureData;
      const uniprotIds = [...row.uniprotAccessions];
      while (uniprotIds.length) {
        _uniprotId = uniprotIds.shift();
        [_structureData] = await safeFetch(
          alphaFoldCifUrl(_uniprotId),
          "text",
        );
        if (_structureData) break;
      }
      if (_structureData) {
        setUniprotId(_uniprotId);
        setStructureData(_structureData);
      } else {
        viewerDispatch({
          type: "setMessage",
          value: "AlphaFold structure not available",
        });
      }
    }
    fetchStructure();
  }, [row]);

  // fetch pathogenicity data
  useEffect(() => {
    if (viewerInteractionState.colorBy === "pathogenicity" &&
        !viewerInteractionState.pathogenicityScores &&
        uniprotId) {
      async function fetchScores() {
        const [scoresByResi] = await fetchPathogenicityScores(uniprotId);
        if (!scoresByResi) return;
        viewerInteractionDispatch({
          type: "setPathogenicityScores",
          value: meanPathogenicityScores(scoresByResi),
        });        
        const computeVariantScore =
          row.referenceAminoAcid.length === 1 && row.alternateAminoAcid.length === 1;
        viewerInteractionDispatch({
          type: "setVariantPathogenicityScore",
          value: computeVariantScore
            ? pickPathogenicityScore(scoresByResi, row.aminoAcidPosition, row.alternateAminoAcid)
            : null
        });
      }
      fetchScores();
    }
  }, [row, structureData, viewerInteractionState.colorBy]);

  if (!structureData) return null;
  
  return (
    // !! NEED TO ADD MESSAGE BOX OVER EVERYTHING !!
    <Box>
      <Viewer
        data={[{ structureData }]}
        onData={(viewerState, viewerStateDispatch) => {
          dataHandler(viewerState, viewerStateDispatch, row)
        }}
        drawAppearance={drawAppearance}
        hoverAppearance={hoverAppearance}
        clickAppearance={clickAppearance}
        trackColor={trackColor}
      />
      {/* <Controls /> */}
    </Box>
  );
}

export default StructureViewer