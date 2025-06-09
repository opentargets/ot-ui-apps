import { CompactAlphaFoldLegend, CompactAlphaFoldPathogenicityLegend } from "ui";
import { getAlphaFoldConfidence } from "@ot/constants";
import { createViewer } from "3dmol";
import {
  Box,
  Typography,
  Button,
  FormLabel,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { resetViewer, onClickCapture, noHoverStyle, hoverManagerFactory } from "./ViewerHelpers";
import { csvParse, mean } from "d3";

const alphaFoldStructureStem = "https://alphafold.ebi.ac.uk/files/";
const alphaFoldStructureSuffix = "-model_v4.cif";

function Viewer({ row }) {
  if (!row) return null;

  const [messageText, setMessageText] = useState("Loading structure ...");
  const [uniprotId, setUniprotId] = useState(null);
  const [viewer, setViewer] = useState(null);
  const [hoveredAtom, setHoveredAtom] = useState(null);
  const [colorBy, setColorBy] = useState("confidence");
  const [pathogenicityScores, setPathogenicityScores] = useState(null);
  const [variantPathogenicityScore, setVariantPathogenicityScore] = useState(null);
  const viewerRef = useRef(null);

  const variantResidues = new Set(
    row.referenceAminoAcid.split("").map((v, i) => i + row.aminoAcidPosition)
  );

  // fetch AlphaFold structure and view it
  useEffect(() => {
    let _viewer;

    async function fetchStructure() {
      let structureData, response;

      async function fetchStructureFile(uniprotId) {
        const pdbUri = `${alphaFoldStructureStem}AF-${uniprotId}-F1${alphaFoldStructureSuffix}`;
        let newResponse;
        try {
          newResponse = await fetch(pdbUri);
          if (newResponse?.ok) response = newResponse;
        } catch (error) {}
      }

      // fetch structure data
      const uniprotIds = [...row.uniprotAccessions];
      let currentUniprotId;
      while (!response && uniprotIds.length) {
        currentUniprotId = uniprotIds.shift();
        await fetchStructureFile(currentUniprotId);
      }
      if (response) {
        structureData = await response.text();
        setUniprotId(currentUniprotId);
      } else {
        setMessageText("AlphaFold structure not available");
      }

      // view data
      if (structureData && viewerRef.current) {
        _viewer = createViewer(viewerRef.current.querySelector(".viewerContainer"), {
          backgroundColor: "#f8f8f8",
          antialias: true,
          cartoonQuality: 10,
        });
        window.viewer = _viewer; // !! REMOVE !!
        const hoverDuration = 10;
        _viewer.getCanvas().ondblclick = () => resetViewer(_viewer, variantResidues, 200); // use ondblclick so replaces existing
        _viewer.addModel(structureData, "cif");
        _viewer.setHoverDuration(hoverDuration);
        // const hoverArgs = hoverManagerFactory({ _viewer, variantResidues, setHoveredAtom });
        // const handleUnhover = hoverArgs[3];
        // _viewer.getCanvas().onmouseleave = () => {
        //   setTimeout(handleUnhover, hoverDuration + 50);
        // };
        // _viewer.setHoverable(...hoverArgs);
        _viewer?.setStyle({}, { hidden: true });
        _viewer.addSurface("VDW", { opacity: 0.55, color: "#fff" }, {});
        noHoverStyle({ viewer: _viewer, variantResidues, colorBy });
        resetViewer(_viewer, variantResidues);
        _viewer.zoom(0.25);
        _viewer.setZoomLimits(20, 500);
        _viewer.render();
        setMessageText("");
        setViewer(_viewer);
      }
    }
    fetchStructure();
    return () => {
      setHoveredAtom("");
      _viewer?.clear();
    };
  }, []);

  // fetch pathogenicity data
  useEffect(() => {
    if (colorBy === "pathogenicity" && !pathogenicityScores && uniprotId) {
      async function fetchPathogenicityScores() {
        let response;
        try {
          // https://alphafold.ebi.ac.uk/files/AF-Q96S37-F1-aa-substitutions.csv
          response = await fetch(
            `https://alphafold.ebi.ac.uk/files/AF-${uniprotId}-F1-aa-substitutions.csv`
          );
          if (!response.ok) {
            console.error(`Failed to fetch pathogenicity data`);
            setPathogenicityScores("failed");
            return;
          }
        } catch (error) {
          console.error(`Failed to fetch pathogenicity data`);
          setPathogenicityScores("failed");
          return;
        }
        const csv = csvParse(await response.text());
        const scores = [];
        const computeVariantScore =
          row.referenceAminoAcid.length === 1 && row.alternateAminoAcid.length === 1;
        for (const [resi, group] of [
          ...Map.groupBy(csv, row => row.protein_variant.match(/\d+/)[0]),
        ]) {
          if (computeVariantScore && Number(resi) === row.aminoAcidPosition) {
            const alternateRow = group.find(
              r => r.protein_variant.at(-1) === row.alternateAminoAcid
            );
            setVariantPathogenicityScore(
              alternateRow ? Number(alternateRow.am_pathogenicity) : "na"
            );
          }
          scores[resi] = mean(group, d => Number(d.am_pathogenicity));
        }
        setPathogenicityScores(scores);
      }
      fetchPathogenicityScores();
    }
  }, [colorBy, uniprotId]); // omit pathogenicityScores to avoid loop

  // change color
  useEffect(() => {
    if (
      !viewer ||
      (colorBy === "pathogenicity" && (!pathogenicityScores || pathogenicityScores === "failed"))
    )
      return;
    noHoverStyle({
      viewer,
      variantResidues,
      colorBy,
      pathogenicityScores,
      variantPathogenicityScore,
    });
    viewer.render();
  }, [colorBy, pathogenicityScores]); // omit viewer to avoid double render at start

  function handleToggleColor(event) {
    setColorBy(event.target.value);
  }

  return (
    <Box ref={viewerRef} position="relative" width="100%">
      {/* container to insert viewer into */}
      <Box className="viewerContainer" position="relative" width="100%" height={350} mb={1}>
        {/* screenshot button */}
        {!messageText && (
          <Box
            sx={{
              top: 0,
              right: 0,
              position: "absolute",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              background: "white",
              m: 1,
            }}
          >
            <Button
              sx={{ display: "flex", gap: 1 }}
              onClick={() => onClickCapture(viewerRef, row.target.id)}
            >
              <FontAwesomeIcon icon={faCamera} /> Screenshot
            </Button>
          </Box>
        )}

        {/* atom info */}
        {hoveredAtom && (
          <Box
            position="absolute"
            bottom={0}
            right={0}
            p="0.6rem 0.8rem"
            zIndex={100}
            bgcolor="#f8f8f8c8"
            sx={{ borderTopLeftRadius: "0.2rem", pointerEvents: "none" }}
            fontSize={14}
          >
            <Box display="flex" flexDirection="column">
              <Typography variant="caption" component="p" textAlign="right">
                {hoveredAtom.resn} {hoveredAtom.resi}
              </Typography>
              <Typography variant="caption" component="p" textAlign="right">
                Confidence: {hoveredAtom.b} ({getAlphaFoldConfidence(hoveredAtom)})
              </Typography>
            </Box>
          </Box>
        )}

        {/* no pathogenicity data meesage */}
        {colorBy === "pathogenicity" && pathogenicityScores === "failed" && (
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
            Pathogenicity data not available
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <FormControl>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormLabel
              sx={{
                "&.Mui-focused": {
                  color: "text.primary",
                },
              }}
            >
              <Typography variant="body2">AlphaFold model colour</Typography>
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="confidence"
              name="color-by-group"
              value={colorBy}
              onChange={handleToggleColor}
            >
              <FormControlLabel
                value="confidence"
                control={<Radio size="small" />}
                label="confidence"
                slotProps={{
                  typography: { variant: "body2" },
                }}
                sx={{
                  mr: 2,
                  "& .MuiFormControlLabel-label": {
                    marginLeft: -0.7,
                  },
                }}
              />
              <FormControlLabel
                value="pathogenicity"
                control={<Radio size="small" />}
                label="pathogenicity"
                slotProps={{
                  typography: { variant: "body2" },
                }}
                sx={{
                  marginRight: 0,
                  "& .MuiFormControlLabel-label": {
                    marginLeft: -0.7,
                  },
                }}
              />
            </RadioGroup>
          </Box>
        </FormControl>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {(colorBy === "confidence" || typeof variantPathogenicityScore !== "number") && (
          <Box
            sx={{ display: "flex", justifyContent: "end", alignItems: "center", gap: 0.75, pr: 3 }}
          >
            <Typography variant="caption" lineHeight={1}>
              Reference amino acid{row.referenceAminoAcid.length > 1 ? "s" : ""}
            </Typography>
            <Box sx={{ width: "11px", height: "11px", borderRadius: "5.5px", bgcolor: "#0d0" }} />
          </Box>
        )}
        <Box>
          {colorBy === "confidence" ? (
            <CompactAlphaFoldLegend showTitle={false} />
          ) : (
            <CompactAlphaFoldPathogenicityLegend showTitle={false} />
          )}
        </Box>
      </Box>

      {/* message text */}
      {messageText && (
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
          {messageText}
        </Typography>
      )}
    </Box>
  );
}

export default Viewer;
