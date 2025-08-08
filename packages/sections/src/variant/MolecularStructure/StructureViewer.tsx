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
  drawHandler,
  trackColor,
} from "./helpers";
import AtomInfo from "./AtomInfo";
import Legend from "./Legend";
import Radios from "./Radios";
import { initialState } from "./context";

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
        viewerDispatch({
          type: "setVariantResidues",
          value: new Set(
            row.referenceAminoAcid.split("").map((v, i) => i + row.aminoAcidPosition)
          )
        });
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

  // structure options
  const structureOptions = {
    cartoon: "cartoon",
    surface: "surface",
    both: "both",
  };

  function handleStructureChange(event) {
    viewerDispatch({
      type: "setRepresentBy",
      value: event.target.value,
    });
  }

  // color options
  const colorOptions = {
    confidence: "confidence",
    pathogenicity: "pathogenicity",
    sequential: "sequential",
    none: "none",
  };

  function handleColorChange(event) {
    viewerDispatch({
      type: "setColorBy",
      value: event.target.value,
    });
  }


  return (
    <Box>
      
      <Viewer
        data={[{ structureData }]}
        onData={(viewer, viewerStateDispatch) => {
          dataHandler(viewer, viewerStateDispatch, row)
        }}
        drawAppearance={drawAppearance}
        hoverAppearance={hoverAppearance}
        clickAppearance={clickAppearance}
        onDraw={drawHandler}
        trackColor={trackColor}
        bottomRight={<AtomInfo />}
      />
      
      <Box
        sx={{
          mt: 0.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        <Radios
          titleLabel="Structure"
          options={structureOptions}
          defaultValue={initialState.representBy}
          stateProperty="representBy"
          handleChange={handleStructureChange}
        />
        <Box>
          <Radios
            titleLabel="Colour"
            options={colorOptions}
            defaultValue={initialState.colorBy}
            stateProperty="colorBy"
            handleChange={handleColorChange}
          />
          <Legend />
        </Box>
      </Box>
    
    </Box>
  );
}

export default StructureViewer