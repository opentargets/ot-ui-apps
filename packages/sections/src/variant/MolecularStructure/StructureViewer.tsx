import { Box, Typography } from "@mui/material";
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
  trackTicks,
} from "./helpers";
import AtomInfo from "./AtomInfo";
import NoPathogenicityScores from "./NoPathogenicityScores";
import Legend from "./Legend";
import Radios from "./Radios";
import Dropdown from "./Dropdown";
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
        viewerDispatch({
          type: "setMessage",
          value: null,
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

  // structure options
  const structureOptions = {
    cartoon: "cartoon",
    hybrid: "hybrid",
    transparent: "transparent",
    opaque: "opaque",
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
    "secondary structure": "secondary structure",
    "residue type": "residue type",
    none: "none",
  };

  function handleColorChange(event) {
    viewerDispatch({
      type: "setColorBy",
      value: event.target.value,
    });
  }

  return (
    <Box sx={{ position: "relative" }}>
      {structureData
        ? (
          <>
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
              trackTicks={trackTicks}
              topLeft={<NoPathogenicityScores />}
              bottomRight={<AtomInfo />}
            />
            <Box
              sx={{
                mt: 1,
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
                onChange={handleStructureChange}
              />
              <Box sx={{ 
                mt: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "flex-start", lg: "flex-end" },
              }}>
                <Dropdown 
                  titleLabel="Colour"
                  options={colorOptions}
                  stateProperty="colorBy"
                  onChange={handleColorChange}
                />
                <Legend />
              </Box>
            </Box>
          </>
        ) : (
          <Box sx={{ height: "590px", width: "100%" }} />
        )
      }

      {/* message text */}
      {viewerState.message && (
        <Typography
          variant="body2"
          component="div"
          sx={{
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            position: "absolute",
            zIndex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f8f8f8",
          }}
        >
          {viewerState.message}
        </Typography>
      )}
    
    </Box>
  );
}

export default StructureViewer