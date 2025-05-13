import { Box, Button, Typography } from "@mui/material";
import { createViewer } from "3dmol";
import { useStateValue, useActions } from "./Context";
import { useState, useEffect, useRef } from "react";
import { getAlphaFoldConfidence } from "@ot/constants";
import { AlphaFoldLegend } from "ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

function setNoHoverStyle(viewer) {
  viewer.setStyle(
    {},
    {
      cartoon: {
        colorfunc: a => getAlphaFoldConfidence(a, "color"),
        arrows: true,
        // opacity: 0.7,
      },
    }
  );
  // addVariantStyle(viewer);
}

export default function Viewer() {
  const viewerHeight = "400px";

  const viewerRef = useRef(null);

  const [messageText, setMessageText] = useState("Loading structure ...");
  const [structureData, setStructureData] = useState(null);
  const [atomInfo, setAtomInfo] = useState(null);

  const { state, filteredRows } = useStateValue();
  const { setViewer } = useActions();

  function onClickCapture() {
    if (!viewerRef.current) return;

    try {
      // Get the canvas element from the container
      const canvas = viewerRef.current.querySelector("canvas");

      if (!canvas) {
        console.error("Canvas element not found");
        return;
      }

      // Create a new canvas with proper background
      const newCanvas = document.createElement("canvas");
      newCanvas.width = canvas.width;
      newCanvas.height = canvas.height;

      const ctx = newCanvas.getContext("2d");

      // Draw background
      ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

      // Draw original canvas content on top
      ctx.drawImage(canvas, 0, 0);

      // Convert the new canvas to data URL
      const dataUrl = newCanvas.toDataURL("image/png");

      // Create a temporary link and trigger download
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${state.data.id}-molecular-structure.png`;
      link.click();
    } catch (error) {
      console.error("Error taking screenshot:", error);
    } finally {
      // setLoading(false);
    }
  }

  // fetch structure data
  useEffect(() => {
    async function fetchStructure() {
      let response;
      const uniprotIds = [
        ...(state.data.proteinCodingCoordinates?.rows?.[0]?.uniprotAccessions ?? []),
      ];

      async function fetchStructureFile(uniprotId) {
        const pdbUri = `https://alphafold.ebi.ac.uk/files/AF-${uniprotId}-F1-model_v4.cif`;
        try {
          const response = await fetch(pdbUri);
          if (response?.ok) return response;
        } catch (error) {}
      }

      while (!response && uniprotIds.length) {
        response = await fetchStructureFile(uniprotIds.shift());
      }
      if (response) {
        try {
          const _structureData = await response.text();
          setStructureData(_structureData);
        } catch (error) {
          console.error(error.message);
          setMessageText("Failed to parse structure data");
        }
      } else {
        setMessageText("Structure data not available");
      }
    }
    fetchStructure();
  }, [state.data.proteinCodingCoordinates, setMessageText]);

  // view structure
  useEffect(() => {
    let viewer;
    if (structureData && viewerRef.current) {
      function setupViewer() {
        console.log("MAKE VIEWER");
        viewer = createViewer(viewerRef.current.querySelector(".viewerContainer"), {
          backgroundColor: "#f8f8f8",
          antialias: true,
          cartoonQuality: 10,
        });
        window.viewer = viewer; // !! REMOVE !!
        setViewer(viewer);
        // viewerRef.current.__viewer__ = viewer;
        const hoverDuration = 10;
        // viewer.getCanvas().ondblclick = () => resetViewer(viewer, 200); // use ondblclick so replaces existing
        viewer.addModel(structureData, "cif");
        viewer.setHoverDuration(hoverDuration);
        // const hoverArgs = hoverManagerFactory({ viewer, atomInfoRef });
        // const hideAtomInfo = hoverArgs[3];
        // viewer.getCanvas().onmouseleave = () => {
        //   setTimeout(hideAtomInfo, hoverDuration + 50);
        // };
        // viewer.setHoverable(...hoverArgs);
        setNoHoverStyle(viewer);
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
        // const viewerAtoms = viewer.getModel().selectedAtoms();
        // viewer.__atomsByResi__ = Map.groupBy(viewerAtoms, atom => atom.resi);
        // viewer.__highlightedResis__ = new Map();
        // viewer.__extraHighlightedResis__ = new Map();
        // highlightVariants(viewer, proteinCodingCoordinates?.rows ?? []);
        // resetViewer(viewer);
        // viewer.zoom(0.2);
        viewer.render();
        setMessageText("");
      }
      setupViewer();
      return () => {
        // hideAtomInfo();
        viewer?.clear();
      };
    }
    // !! DODGY TO LOCAL VARIABLE AS DE. HOW SHOLD KNOW WHEN REQUEST FULFILLED?
  }, [structureData]);

  return (
    <Box ref={viewerRef} position="relative" width="100%">
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
            // disabled={structureLoading}
            onClick={onClickCapture}
          >
            <FontAwesomeIcon icon={faCamera} /> Screenshot
          </Button>
        </Box>
      )}
      <Box className="viewerContainer" position="relative" width="100%" height={viewerHeight} />
      <AlphaFoldLegend />
      {atomInfo && (
        <Box
          position="absolute"
          bottom={0}
          right={0}
          p="0.6rem 0.8rem"
          zIndex={10}
          bgcolor="#f8f8f8c8"
          sx={{ borderTopLeftRadius: "0.2rem", pointerEvents: "none" }}
          fontSize={14}
        >
          <Box display="flex" flexDirection="column">
            {JSON.stringify(atomInfo)}
            {/* <Typography variant="caption" component="p" textAlign="right" />
            <Typography variant="caption" component="p" textAlign="right" /> */}
          </Box>
        </Box>
      )}
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
