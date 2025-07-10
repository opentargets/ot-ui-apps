import { useState, useEffect, useRef } from "react";
import { createViewer } from "3dmol";
import { Box, Button } from "@mui/material";
import { useViewerState } from "./Context";
import Usage from "./Usage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "ui";
import { onClickCapture } from "./helpers";

const hoverDuration = 50;

// !!!!! ADD PROP TYPES !!!!!

export default function Viewer({
  height = "400px",
  data,
  onData,
  onDblClick,
  dep = [],
  drawAppearance = [],
  clickAppearance = [],
  hoverAppearance = [],
  usage,
  topLeft,
  bottomRight,
  zoomLimit = [20, 500],
  screenshotId = "",
}) {
  
  const [viewer, setViewer] = useState(null);
  const viewerState = useViewerState();

  function resolveProperty(appearance, propertyName, ...args) {
    const value = appearance[propertyName];
    return typeof value === "function" ? value(...args) : value ?? {};
  }
  
  function applyAppearance(
    appearance,
    atom = null, // only non-null for click/hover-triggered appearance changes
    selection = "selection",
    style = "style"
  ) {
    viewer[appearance.addStyle ? "addStyle" : "setStyle"](
      resolveProperty(appearance, selection, viewerState, atom),
      resolveProperty(appearance, style, viewerState, atom)
    );
  }

  // create viewer
  useEffect(() => {
    if (!data) return;

    // create viewer and add basic functionality
    const _viewer = createViewer(viewerRef.current.querySelector(".viewerContainer"), {
      backgroundColor: "#f8f8f8",
      antialias: true,
      cartoonQuality: 10,
      lowerZoomLimit: zoomLimit[0],
      upperZoomLimit: zoomLimit[1],
    });
    _viewer.getCanvas().addEventListener(
      "wheel",
      event => {
        if (!event.ctrlKey) event.stopImmediatePropagation();
      },
      true // use capture phase so fires before library handler
    );
    if (onDblClick) {
      _viewer.getCanvas().ondblclick = event => {
        onDblClick(event, _viewer, viewerState); 
      }
    }
    _viewer.setHoverDuration(hoverDuration);
    setViewer(_viewer);

    // click behavior
    for (const [index, appearance] of clickAppearance.entries()) {
      _viewer.setClickable(
        appearance.eventSelection,
        true,
        atom => {
          applyAppearance(appearance, atom);
          appearance.onApply?.(viewerState, atom);
          if (index === clickAppearance.length - 1) _viewer.render();
        }
      );
    }

    // hover behavior
    for (const appearance of hoverAppearance.entries()) {
      _viewer.setHoverable(
        appearance.eventSelection,
        true,
        atom => {
          applyAppearance(appearance, atom);
          appearance.onApply?.(viewerState, atom);
          if (index === hoverAppearance.length - 1) _viewer.render();
        }
        atom => {
          applyAppearance(appearance, atom, "unhoverSelection", "unhoverStyle");
          appearance.onUnapply?.(viewerState, atom);
          if (index === hoverAppearance.length - 1) _viewer.render();
        }
      );
    }

    // load data into viewer
    data.map(({ structureData }) => _viewer.addModel(structureData, "cif"));
    onData?.(_viewer, viewerState);

    return () => _viewer.clear();
  }, []);

  // draw/redraw
  const prevDepValues = useRef({});
  useEffect(() => {
    if (!viewer) return;
    
    // hide everything
    _viewer?.setStyle({}, { hidden: true });

    // state properties that changed
    if (dep?.length) {
      let depChanged = false;
      for (const key of Object.keys(viewerState)) {
        if (viewerState[key] !== prevDepValues.current[key]) {
          prevDepValues.current[key] = viewerState[key];
          depChanged = true;
        }
      }
      if (depChanged) return;
    }

    // apply appearances
    for (const appearance of drawAppearance) {
      if (!appearance.use || appearance.use(viewerState)) {
        applyAppearance(appearance);
      }
    }
    viewer.render();

  }, [viewer, viewerState]);

  return (
    <Box ref={viewerRef} position="relative" width="100%" height={height}>

      {/* info and screenshot button */}
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

        {/* usage popup button */}
        {usage && <Usage instructions={usage} />}
        
        {/* screenshot button */}
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
            onClick={() => onClickCapture(viewerRef, screenshotId)}
          >
            <FontAwesomeIcon icon={faCamera} />
          </Button>
        </Tooltip>
      </Box>

      {/* top-left info box */}
      {topLeft && (
        <Box
          position="absolute"
          top={0}
          left={0}
          p="0.6rem 0.8rem"
          zIndex={100}
          bgcolor="#f8f8f8c8"
          sx={{ borderBottomRightRadius: "0.2rem", pointerEvents: "none" }}
          fontSize={14}
        >
          {topLeft}
        </Box>
      )}

      {/* bottom-right info box */}
      {bottomRight && (
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
          {bottomRight}
        </Box>
      )}

    </Box>
  );
}