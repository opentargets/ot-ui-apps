import { useState, useEffect, useRef   } from "react";
import { createViewer } from "3dmol";
import { Box, Typography, Button } from "@mui/material";
import { useViewerState } from "./ViewerProvider";
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
  drawAapearance = [],
  clickAppearance = [],
  hoverAppearance = [],
  initialMessage = "Loading structure ...",
  zoomLimit,
  usage,
  topLeft,
  bottomRight,
  screenshotId = "",
}) {
  
  const [message, setMessage] = useState(initialMessage);
  const [viewer, setViewer] = useState(null);
  const viewerState = useViewerState();
  const viewerDispatch = useViewerDispatch();

  function resolveProperty(appearance, propertyName, ...args) {
    const value = appearance[propertyName];
    return typeof value === "function" ? value(...args) : value ?? {};
  }

  // atom only used for click/hover-triggered appearance changes 
  function applyAppearance(
    appearance,
    atom = null,
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
    if (!data) {
      setMessage("No data");
      return;
    }

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
        onDblClick(event, _viewer, data, setMessage); 
      }
    }
    _viewer.setHoverDuration(hoverDuration);
    setViewer(_viewer);

    // click behavior
    for (const appearance of clickAppearance) {
      _viewer.setClickable(
        appearance.eventSelection,
        true,
        atom => {
          applyAppearance(appearance, atom);
          appearance.onApply?.(viewerState, atom);
        }
      );
    }

    // hover behavior
    for (const appearance of hoverAppearance) {
      _viewer.setHoverable(
        appearance.eventSelection,
        true,
        atom => {
          applyAppearance(appearance, atom);
          appearance.onApply?.(viewerState, atom);

        }
        atom => {
          applyAppearance(appearance, atom, "unhoverSelection", "unhoverStyle");
          appearance.onUnapply?.(viewerState, atom);
        }
      );
    }

    // load data into viewer
    const models = data.map(({ structureData }) => _viewer.addModel(structureData, "cif"));
    onData?.(_viewer, data, setMessage);

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
    for (const appearance of drawAapearance) {
      if (!appearance.use || appearance.use(viewerState)) {
        applyAppearance(appearance);
      }
    }
    viewer.render();

  }, [viewer, viewerState]);

  return (
    <Box ref={viewerRef} position="relative" width="100%">
      {/* container to insert viewer into */}
      <Box className="viewerContainer" position="relative" width="100%" height={height}>
        {/* info and screenshot button */}
        {!message && (
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
        )}

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

      {/* message */}
      {message && (
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
          {message}
        </Typography>
      )}

    </Box>
  );
}