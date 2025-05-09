import { Box, Button, Grid, Typography } from "@mui/material";
import { createViewer } from "3dmol";
let viewer;
import { useStateValue, useActions } from "./Context";

export default function Viewer();

  const state = useStateValue();
  const actions = useActions();

// showLoadingMessage();
// let data, response;

???? IS THERE ANY POINT HANDLING DATA STATES IN CONTEXT RATHER THAN NORMAL WAY??????

async function fetchStructureFile(uniprotId) {
  const pdbUri = `https://alphafold.ebi.ac.uk/files/AF-${uniprotId}-F1-model_v4.cif`;
  let newResponse;
  try {
    newResponse = await fetch(pdbUri);
    if (newResponse?.ok) response = newResponse;
  } catch (error) {}
}

// fetch structure data
const uniprotIds = [...(proteinCodingCoordinates?.rows?.[0]?.uniprotAccessions ?? [])];
while (!response && uniprotIds.length) {
  await fetchStructureFile(uniprotIds.shift());
}

// parse data
if (response) {
  try {
    data = await response.text();
  } catch (error) {
    console.error(error.message);
    showLoadingMessage("Failed to parse structure data");
  }
}

// view data
if (data && viewerRef.current) {
  viewer = createViewer(viewerRef.current, {
    backgroundColor: "#f8f8f8",
    antialias: true,
    cartoonQuality: 10,
  });
  window.viewer = viewer; // !! REMOVE !!
  setMolViewer(viewer);
  // viewerRef.current.__viewer__ = viewer;
  const hoverDuration = 10;
  // viewer.getCanvas().ondblclick = () => resetViewer(viewer, 200); // use ondblclick so replaces existing
  viewer.addModel(data, "cif"); /* load data */
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
  const viewerAtoms = viewer.getModel().selectedAtoms();
  viewer.__atomsByResi__ = Map.groupBy(viewerAtoms, atom => atom.resi);
  viewer.__highlightedResis__ = new Map();
  viewer.__extraHighlightedResis__ = new Map();
  highlightVariants(viewer, proteinCodingCoordinates?.rows ?? []);
  resetViewer(viewer);
  // viewer.zoom(0.2);
  viewer.render();
  hideLoadingMessage();

  return (
    <Box>
      <Typography
        ref={messageRef}
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
        }}
      />
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
          disabled={structureLoading}
          onClick={onClickCapture}
        >
          <FontAwesomeIcon icon={faCamera} /> Screenshot
        </Button>
      </Box>
      <Box
        ref={atomInfoRef}
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
          <Typography variant="caption" component="p" textAlign="right" />
          <Typography variant="caption" component="p" textAlign="right" />
        </Box>
      </Box>
    </Box>
  );
}
