import { Box } from "@mui/material";
import { Viewer, useViewerState, useViewerDispatch } from "ui";
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
import Controls from "./Controls";

function StructureViewer({ row }) {
  const viewerState = useViewerState();
  const viewerDispatch = useViewerDispatch();
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
    if (viewerState.colorBy === "pathogenicity" &&
        !viewerState.pathogenicityScores &&
        uniprotId) {
      async function fetchScores() {
        const [scoresByResi] = await fetchPathogenicityScores(uniprotId);
        if (!scoresByResi) return;
        viewerDispatch({
          type: "setPathogenicityScores",
          value: meanPathogenicityScores(scoresByResi),
        });        
        const computeVariantScore =
          row.referenceAminoAcid.length === 1 && row.alternateAminoAcid.length === 1;
        viewerDispatch({
          type: "setVariantPathogenicityScore",
          value: computeVariantScore
            ? pickPathogenicityScore(scoresByResi, row.aminoAcidPosition, row.alternateAminoAcid)
            : null
        });
      }
      fetchScores();
    }
  }, [row, structureData, viewerState.colorBy]);

  if (!structureData) return null;
  
  return (
    // !! NEED TO ADD MESSAGE BOX OVER EVERYTHING !!
    <Box>
      
      <Viewer
        data={[{ structureData }]}
        onData={(viewer, viewerStateDispatch) => {
          dataHandler(viewer, viewerStateDispatch, row)
        }}
        drawAppearance={drawAppearance}
        hoverAppearance={hoverAppearance}
        clickAppearance={clickAppearance}
        trackColor={trackColor}
      />
      
      {/* wrapper for controls and legend */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        <Controls />
      </Box>
    </Box>
  );
}

export default StructureViewer