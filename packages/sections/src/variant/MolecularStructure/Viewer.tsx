import { CompactAlphaFoldLegend, CompactAlphaFoldPathogenicityLegend, Tooltip } from "ui";
import {
  getAlphaFoldConfidence,
  getAlphaFoldPathogenicity,
  alphaFoldPathogenicityColorScale,
  aminoAcidLookup,
  naLabel,
} from "@ot/constants";
import { createViewer, Vector2 } from "3dmol";
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
import { faCamera, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import {
  resetViewer,
  onClickCapture,
  drawCartoon,
  drawVariantSurface,
  setVariantSurfaceColor,
  setHoverBehavior,
} from "./ViewerHelpers";
import { csvParse, mean } from "d3";
import InfoPopper from "./InfoPopper";
import { grey } from "@mui/material/colors";

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
        _viewer.addModel(structureData, "cif");

        // variant's reference amino acid should match amino acid at same position in structure data
        const structureReferenceAminoAcid = _viewer
          .getModel()
          .selectedAtoms()
          .find(atom => atom.resi === row.aminoAcidPosition)?.resn;
        if (aminoAcidLookup[row.referenceAminoAcid[0]] !== structureReferenceAminoAcid) {
          setMessageText("AlphaFold structure not available");
          return;
        }

        _viewer.getCanvas().addEventListener(
          "wheel",
          event => {
            if (!event.ctrlKey) event.stopImmediatePropagation();
          },
          true // use capture phase so fires before library handler
        );
        _viewer.getCanvas().ondblclick = () => resetViewer(_viewer, variantResidues, 200);
        _viewer?.setStyle({}, { hidden: true });
        _viewer.addSurface("VDW", { opacity: 0.55, color: "#fff" }, {});
        _viewer.addLabel(
          " variant ",
          {
            alignment: "center",
            screenOffset: new Vector2(30, -30),
            backgroundColor: "#fff",
            backgroundOpacity: 0.9,
            borderColor: "#999",
            borderThickness: 1.5,
            font: "'Inter', sans-serif",
            fontColor: "#444",
            fontSize: 12.5,
            inFront: true,
          },
          { resi: [...variantResidues][0] }
        );
        drawCartoon({ viewer: _viewer, colorBy, variantResidues });
        drawVariantSurface({ viewer: _viewer, variantResidues, color: "#0d0" });
        resetViewer(_viewer, variantResidues);
        _viewer.zoom(0.25);
        _viewer.setZoomLimits(20, 500);
        setHoverBehavior({
          viewer: _viewer,
          variantResidues,
          setHoveredAtom,
          colorBy,
        });
        _viewer.render();
        setMessageText("");
        setViewer(_viewer);
      }
    }
    fetchStructure();
    return () => {
      setHoveredAtom(null);
      _viewer?.clear();
    };
  }, []);

  // fetch pathogenicity data
  useEffect(() => {
    if (colorBy === "pathogenicity" && !pathogenicityScores && uniprotId) {
      async function fetchPathogenicityScores() {
        let response;
        try {
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
            if (alternateRow) {
              setVariantPathogenicityScore(Number(alternateRow.am_pathogenicity));
            }
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
    drawCartoon({ viewer, colorBy, pathogenicityScores, variantResidues });
    setVariantSurfaceColor({
      viewer,
      color:
        colorBy === "confidence" || variantPathogenicityScore === null
          ? "#0d0"
          : alphaFoldPathogenicityColorScale(variantPathogenicityScore),
    });
    setHoverBehavior({
      viewer,
      variantResidues,
      setHoveredAtom,
      colorBy,
      pathogenicityScores,
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
        {/* info and screenshot button */}
        {!messageText && (
          <Box
            sx={{
              top: 0,
              right: 0,
              position: "absolute",
              zIndex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              m: 1,
              gap: 1,
            }}
          >
            <InfoPopper />
            <Tooltip title="Screenshot" placement="top-start">
              <Button
                sx={{
                  display: "flex",
                  gap: 1,
                  bgcolor: "white",
                  "&:hover": {
                    bgcolor: "#f8f8f8d8",
                  },
                }}
                onClick={() => onClickCapture(viewerRef, row?.target.id)}
              >
                <FontAwesomeIcon icon={faCamera} />
              </Button>
            </Tooltip>
          </Box>
        )}

        {/* atom info */}
        {hoveredAtom && (
          <AtomInfo
            hoveredAtom={hoveredAtom}
            colorBy={colorBy}
            pathogenicityScores={pathogenicityScores}
            variantPathogenicityScore={variantPathogenicityScore}
            variantResidues={variantResidues}
          />
        )}

        {colorBy === "pathogenicity" && variantPathogenicityScore === null && (
          <NoVariantPathogenicityScore />
        )}

        {/* no pathogenicity data message */}
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
          justifyContent: "space-between",
          alignItems: "start",
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        {/* confidence-pathogenicity toggle buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <FormControl>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 1 }}>
              <FormLabel
                sx={{
                  "&.Mui-focused": {
                    color: "text.primary",
                  },
                }}
              >
                <Typography variant="subtitle2">AlphaFold model colour:</Typography>
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

        <Box>
          {/* explanatory text */}
          {colorBy === "pathogenicity" && Array.isArray(pathogenicityScores) && (
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
                    mean AlphaMissense pathogenicity over all possible amino acid substitutions
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

          {/* legends */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              flexWrap: "wrap",
              ml: { xs: 1, lg: 0 },
            }}
          >
            {(colorBy === "confidence" || variantPathogenicityScore === null) && (
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
                  Reference amino acid{row.referenceAminoAcid.length > 1 ? "s" : ""}
                </Typography>
                <Box
                  sx={{ width: "11px", height: "11px", borderRadius: "5.5px", bgcolor: "#0d0" }}
                />
              </Box>
            )}
            <Box>
              {colorBy === "confidence" || !Array.isArray(pathogenicityScores) ? (
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
      </Box>
    </Box>
  );
}

function NoVariantPathogenicityScore() {
  return (
    <Box
      bgcolor="#fff"
      zIndex={100}
      fontSize={14}
      sx={{
        position: "absolute",
        left: "8px",
        top: "8px",
        px: 2,
        py: 1,
        border: 1,
        borderColor: grey[200],
      }}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "baseline" }}>
        <FontAwesomeIcon icon={faTriangleExclamation} />
        <Typography variant="body2">No variant pathogenicity score</Typography>
      </Box>
    </Box>
  );
}

function AtomInfo({
  hoveredAtom,
  colorBy,
  pathogenicityScores,
  variantPathogenicityScore,
  variantResidues,
}) {
  const onVariant = variantResidues.has(hoveredAtom.resi);

  const averagePathoText = () =>
    `${pathogenicityScores[hoveredAtom.resi].toFixed(3)} (${getAlphaFoldPathogenicity(
      hoveredAtom,
      pathogenicityScores
    ).toLowerCase()})`;
  const variantPathoText = () =>
    `${variantPathogenicityScore.toFixed(3)} (${getAlphaFoldPathogenicity({ resi: 0 }, [
      variantPathogenicityScore,
    ]).toLowerCase()})`;

  return (
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
          {colorBy === "confidence" ? (
            `Confidence: ${hoveredAtom.b} (${getAlphaFoldConfidence(hoveredAtom).toLowerCase()})`
          ) : !Array.isArray(pathogenicityScores) ? (
            ""
          ) : (
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
          )}
        </Typography>
      </Box>
    </Box>
  );
}

export default Viewer;
