import { CompactAlphaFoldLegend } from "ui";
import { getAlphaFoldConfidence } from "@ot/constants";
import { createViewer } from "3dmol";
import { Box, Typography, Button } from "@mui/material";

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { resetViewer, onClickCapture, noHoverStyle, hoverManagerFactory } from "./ViewerHelpers";

const alphaFoldStructureStem = "https://alphafold.ebi.ac.uk/files/";
const alphaFoldStructureSuffix = "-model_v4.cif";

function Viewer({ row }) {
  if (!row) return null;

  const [messageText, setMessageText] = useState("Loading structure ...");
  const [hoveredAtom, setHoveredAtom] = useState(null);
  const viewerRef = useRef(null);

  const variantResidues = new Set(
    row.referenceAminoAcid.split("").map((v, i) => i + row.aminoAcidPosition)
  );

  // fetch AlphaFold structure and view it
  useEffect(() => {
    let viewer;

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
      while (!response && uniprotIds.length) {
        await fetchStructureFile(uniprotIds.shift());
      }

      // parse structure data
      if (response) {
        try {
          structureData = await response.text();
        } catch (error) {
          console.error(error.message);
          setMessageText("Failed to parse structure data");
        }
      } else {
        setMessageText("AlphaFold structure not available");
      }

      // view data
      if (structureData && viewerRef.current) {
        viewer = createViewer(viewerRef.current.querySelector(".viewerContainer"), {
          backgroundColor: "#f8f8f8",
          antialias: true,
          cartoonQuality: 10,
        });
        window.viewer = viewer; // !! REMOVE !!
        const hoverDuration = 10;
        viewer.getCanvas().ondblclick = () => resetViewer(viewer, variantResidues, 200); // use ondblclick so replaces existing
        viewer.addModel(structureData, "cif");
        viewer.setHoverDuration(hoverDuration);
        const hoverArgs = hoverManagerFactory({ viewer, variantResidues, setHoveredAtom });
        const handleUnhover = hoverArgs[3];
        viewer.getCanvas().onmouseleave = () => {
          setTimeout(handleUnhover, hoverDuration + 50);
        };
        viewer.setHoverable(...hoverArgs);
        noHoverStyle(viewer, variantResidues);
        // viewer.addSurface(
        //   "VDW",
        //   {
        //     opacity: 1,
        //     opacity: 0.65,
        //     color: "#fff",
        //     // color: {'prop': 'b', map:elementColors.greenCarbon}
        //   },
        //   {}
        // );
        viewer.addSurface("VDW", { opacity: 0.75, color: "#0f0" }, { resi: [...variantResidues] });
        resetViewer(viewer, variantResidues);
        viewer.zoom(0.2);
        viewer.render();
        // hideLoadingMessage();
        setMessageText("");
      }
    }
    fetchStructure();
    return () => {
      // hideAtomInfo();
      setHoveredAtom("");
      viewer?.clear();
    };
  }, []);

  return (
    <Box ref={viewerRef} position="relative" width="100%">
      {/* info text */}
      {/* <Typography variant="body2" sx={{ py: 3 }}>
        AlphaFold prediction with reference allele of variant highlighted. What else from API do we
        want here or in subheader above?
      </Typography> */}

      {/* container to insert viewer into */}
      <Box className="viewerContainer" position="relative" width="100%" height={300} mb={1}>
        {/* screenshot button */}
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
              background: "white",
              m: 1,
            }}
          >
            <Button
              sx={{ display: "flex", gap: 1 }}
              onClick={() => onClickCapture(viewerRef, state.data.id)}
            >
              <FontAwesomeIcon icon={faCamera} /> Screenshot
            </Button>
          </Box>
        )}

        {/* atom info */}
        {hoveredAtom && (
          <Box
            // ref={atomInfoRef}
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
      </Box>

      <CompactAlphaFoldLegend />

      {/* message text */}
      {/* {messageText && (
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
      )} */}
    </Box>
  );
}

export default Viewer;
