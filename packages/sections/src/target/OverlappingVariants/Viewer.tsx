import { Box, Button, Typography } from "@mui/material";
import { createViewer } from "3dmol";
import { useStateValue, useActions } from "./Context";
import { useState, useEffect, useRef } from "react";
import { extent } from "d3";
import { CompactAlphaFoldLegend, Tooltip } from "ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import {
  setNoHoverStyle,
  highlightVariants,
  highlightVariantFromTable,
  onClickCapture,
} from "./viewerHelpers";
import InfoPopper from "./InfoPopper";

export default function Viewer({ id: ensemblId }) {
  const viewerHeight = "480px";

  const viewerRef = useRef(null);

  const [messageText, setMessageText] = useState("Loading structure ...");
  const [structureData, setStructureData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);

  const { state, filteredRows } = useStateValue();
  const { setStartPosition, setUniprotId, setAlphaFoldInfo } = useActions();
  const { setViewer } = useActions();

  // fetch structure data
  useEffect(() => {
    async function fetchStructure() {
      async function fetchStructureFile(uniprotId) {
        const pdbUri = `https://alphafold.ebi.ac.uk/files/AF-${uniprotId}-F1-model_v4.cif`;
        try {
          const response = await fetch(pdbUri);
          if (response?.ok) return response;
        } catch (error) {}
      }
      const uniprotIds = [
        ...(state.data.proteinCodingCoordinates?.rows?.[0]?.uniprotAccessions ?? []),
      ];
      let currentUniprotId = null;
      let alphaFoldResponse = null;
      while (!alphaFoldResponse && uniprotIds.length) {
        currentUniprotId = uniprotIds.shift();
        alphaFoldResponse = await fetchStructureFile(currentUniprotId);
      }
      if (alphaFoldResponse) {
        setStructureData(await alphaFoldResponse.text());
        setUniprotId(currentUniprotId);
      } else {
        setMessageText("Structure data not available");
      }
    }
    fetchStructure();
  }, [state.data.proteinCodingCoordinates]);

  // view structure
  useEffect(() => {
    let viewer;
    if (structureData && viewerRef.current) {
      function setupViewer() {
        viewer = createViewer(viewerRef.current.querySelector(".viewerContainer"), {
          backgroundColor: "#f8f8f8",
          antialias: true,
          cartoonQuality: 10,
        });
        window.viewer = viewer; // !! REMOVE !!
        setViewer(viewer);
        viewer.getCanvas().addEventListener(
          "wheel",
          event => {
            if (!event.ctrlKey) event.stopImmediatePropagation();
          },
          true // use capture phase so fires before library handler
        );
        const hoverDuration = 50;
        viewer.addModel(structureData, "cif");
        // viewer.getCanvas().ondblclick = () => resetViewer(viewer, 200); // use ondblclick so replaces existing
        viewer.setHoverDuration(hoverDuration);
        setNoHoverStyle(viewer);
        const viewerAtoms = viewer.getModel().selectedAtoms();
        viewer.__atomsByResi__ = Map.groupBy(viewerAtoms, atom => atom.resi);
        viewer.__highlightedResis__ = new Map();
        viewer.__extraHighlightedResi__ = null;
        setAlphaFoldInfo({
          indexExtent: extent(viewer.getModel().selectedAtoms(), d => d.resi),
          referenceAminoAcids: new Map(
            [...viewer.__atomsByResi__].map(([index, atoms]) => [index, atoms[0].resn])
          ),
        });
        highlightVariants({ viewer, filteredRows, setStartPosition, setHoverInfo });
        // resetViewer(viewer);
        // viewer.zoom(0.2);
        viewer.render();
        setMessageText("");
      }
      setupViewer();
      return () => {
        viewer?.clear();
      };
    }
    // !! DODGY TO LOCAL VARIABLE AS DE. HOW SHOLD KNOW WHEN REQUEST FULFILLED?
  }, [structureData]);

  // highlight variants
  useEffect(() => {
    if (state.viewer) {
      highlightVariants({ viewer: state.viewer, filteredRows, setStartPosition, setHoverInfo });
    }
  }, [state.viewer, filteredRows]);

  // (un)highlight variant corresponding to (un)hovered
  useEffect(() => {
    highlightVariantFromTable({ viewer: state.viewer, row: state.hoveredRow.at(-1) });
  }, [state.viewer, state.hoveredRow]);

  return (
    <Box ref={viewerRef} position="relative" width="100%">
      <Box
        className="viewerContainer"
        position="relative"
        width="100%"
        height={viewerHeight}
        mb={1}
      >
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
                onClick={() => onClickCapture(viewerRef, ensemblId)}
              >
                <FontAwesomeIcon icon={faCamera} />
              </Button>
            </Tooltip>
          </Box>
        )}
        {hoverInfo && <HoverBox hoverInfo={hoverInfo} />}
      </Box>

      <CompactAlphaFoldLegend />
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

function HoverBox({ hoverInfo }) {
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
          Start Position: {hoverInfo.startPosition}
          <br />
          Variants: {hoverInfo.rows.length}
          <br />
          <Box
            component="span"
            sx={{
              display: "inline-block",
              maxWidth: "240px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            Change:{" "}
            {hoverInfo.rows.map(
              (row, index) =>
                `${index > 0 ? ", " : ""}${row.referenceAminoAcid}${row.aminoAcidPosition}${
                  row.alternateAminoAcid
                }`
            )}
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}
