import { useState, useEffect, useRef } from "react";
import { createViewer } from "3dmol";
import { Box, Button } from "@mui/material";
import { useViewerState, useViewerDispatch } from "../../providers/ViewerProvider";
import { useViewerInteractionState, useViewerInteractionDispatch } from "ui";
import Usage from "./Usage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { Tooltip, ViewerTrack } from "ui";
import { onClickCapture } from "./helpers";

const hoverDuration = 0;

// !!!!! ADD PROP TYPES !!!!!

export default function Viewer({
  height = "400px",
  data,
  onData,
  onDblClick,
  onDraw,
  drawAppearance = [],
  hoverAppearance = [],
  clickAppearance = [],
  trackColor,
  usage = {},
  topLeft,
  bottomRight,
  zoomLimit = [20, 500],
  screenshotId = "",
}) {
  const [viewer, setViewer] = useState(null);
  const viewerState = useViewerState();
  const viewerDispatch = useViewerDispatch();
  const viewerInteractionState = useViewerInteractionState();
  const viewerInteractionDispatch = useViewerInteractionDispatch();

  const viewerRef = useRef(null);
  const oldHoveredResi = useRef(null);
  const oldClickedResi = useRef(null);
  const clickHandled = useRef(false);
  const manipulating = useRef(false);
  const startedManipulating = useRef(0);

  function resolveProperty(appearance, propertyName, ...args) {
    let value = appearance[propertyName];
    if (!value && propertyName.toLowerCase().includes("selection")) {
      value = {};
    }
    return typeof value === "function" ? value(...args) : value;
  }

  function applyAppearance(
    appearance,
    resi = null, // only non-null for click/hover on structure (not track) appearance changes
    selection = "selection",
    style = "style",
    addStyle = "addStyle",
  ) {
    const resolvedStyle = resolveProperty(appearance, style, viewerState, resi);
    if (!resolvedStyle) return;
    viewer[appearance[addStyle] ? "addStyle" : "setStyle"](
      resolveProperty(appearance, selection, viewerState, resi),
      resolvedStyle
    );
  }

  // create viewer and load data
  useEffect(() => {
    let _viewer;

    if (data && viewerRef.current) {

      // create viewer
      _viewer = createViewer(viewerRef.current, {
        backgroundColor: "#f8f8f8",
        antialias: true,
        cartoonQuality: 10,
        lowerZoomLimit: zoomLimit[0],
        upperZoomLimit: zoomLimit[1],
      });
      if (onDblClick) {
        _viewer.getCanvas().addEventListener("dblclick", event => {
          onDblClick(viewerState);
        });
      }
      _viewer.setHoverDuration(hoverDuration);

      // disable wheel-zoom
      setViewer(_viewer);
      _viewer.getCanvas().addEventListener(
        "wheel",
        event => {
          if (!event.ctrlKey) event.stopImmediatePropagation();
        },
        true // use capture phase so fires before library handler
      );

      // load data into viewer`
      data.map(({ structureData }) => _viewer.addModel(structureData, "cif"));
      onData?.(_viewer, viewerDispatch);

      // set state viewer after load data - since state groups atoms by resi
      viewerDispatch({ type: '_setViewer', value: _viewer });
    }

    // interaction
    if (viewerInteractionState) {

      // disable hover when mousedown
      _viewer.getCanvas().addEventListener(
        "mousedown",
        event => {
          manipulating.current = true;
          startedManipulating.current = Date.now();
        }
      );
      _viewer.getCanvas().addEventListener(
        "mouseup",
        event => {
          viewerInteractionDispatch({ type: "setHoveredResi", value: null });
          manipulating.current = false;
        }
      );
      
      // click event on canvas for 'click off' events
      _viewer.getCanvas().addEventListener("click", event => {
        setTimeout(() => {
          if(
            !clickHandled.current &&
            Date.now() - startedManipulating.current < 250  // click rather than manipulate structure
          ) {
            viewerInteractionDispatch({ type: "setClickedResi", value: null });
          }
          clickHandled.current = false;
        }, 0);
      });

      // click
      for (const appearance of clickAppearance) {
        _viewer.setClickable(appearance.eventSelection ?? {}, true, atom => {
          viewerInteractionDispatch({ type: "setClickedResi", value: +atom.resi });
          clickHandled.current = true;
        });
      }

      // hover
      for (const appearance of hoverAppearance) {
        _viewer.setHoverable(
          appearance.eventSelection ?? {},
          true,
          atom => {
            if (!manipulating.current) {
              viewerInteractionDispatch({ type: "setHoveredResi", value: +atom.resi });
            }
          },
          atom => {
            if (!manipulating.current) {
              viewerInteractionDispatch({ type: "setHoveredResi", value: null });
            }
          }
        );
        _viewer.render();  // required to reactivate hover
      }

      // clear hover when leave canvas
      _viewer.getCanvas().onmouseleave = () => {
        setTimeout(() => {
          viewerInteractionDispatch({ type: "setHoveredResi", value: null });
        }, hoverDuration + 50);
      };
    }

    return () => _viewer.clear();
  }, []);

  // update for change in clicked resi
  useEffect(() => {
    if (!viewer || !viewerInteractionState) return;

    // unclick
    if (oldClickedResi.current) {
      for (const [index, appearance] of clickAppearance.entries()) {
        const a = {...appearance };
        const resi = Number(oldClickedResi.current);
        if (!a.leaveSelection) a.leaveSelection = { resi };
        applyAppearance(a, resi, "leaveSelection", "leaveStyle", "leaveAddStyle");
        a.leaveOnApply?.(viewerState, resi, viewerInteractionState, viewerInteractionDispatch);
        if (index === clickAppearance.length - 1) viewer.render();
      }
    }

    // click
     if (viewerInteractionState.clickedResi) {
      for (const [index, appearance] of clickAppearance.entries()) {
        const a = { ...appearance };
        const resi = Number(viewerInteractionState.clickedResi);
        if (!a.selection) a.selection = { resi };
        applyAppearance(a, resi);
        a.onApply?.(viewerState, resi, viewerInteractionState, viewerInteractionDispatch);
        if (index === clickAppearance.length - 1) viewer.render();
      }
    }

    oldClickedResi.current = viewerInteractionState.clickedResi;
  }, [viewer, viewerInteractionState?.clickedResi]);

  // update for change in hovered resi
  useEffect(() => {
    if (!viewer || !viewerInteractionState) return;
    
    // unhover
    if (oldHoveredResi.current) {
      for (const [index, appearance] of hoverAppearance.entries()) {
        const a = {...appearance };
        const resi = Number(oldHoveredResi.current);
        if (!a.leaveSelection) a.leaveSelection = { resi };
        applyAppearance(a, resi, "leaveSelection", "leaveStyle", "leaveAddStyle");
        a.leaveOnApply?.(viewerState, resi, viewerInteractionState, viewerInteractionDispatch);
        if (index === hoverAppearance.length - 1) viewer.render();
      }
    }
      
    // hover
    if (viewerInteractionState.hoveredResi) {
      for (const [index, appearance] of hoverAppearance.entries()) {
        const a = {...appearance };
        const resi = Number(viewerInteractionState.hoveredResi);
        if (!a.selection) a.selection = { resi };
        applyAppearance(a, resi);
        a.onApply?.(viewerState, resi, viewerInteractionState, viewerInteractionDispatch);
        if (index === hoverAppearance.length - 1) viewer.render();
      }
    }
    
    oldHoveredResi.current = viewerInteractionState.hoveredResi;
  }, [viewer, viewerInteractionState?.hoveredResi]);

  // draw/redraw
  useEffect(() => {
    if (!viewer) return;
    viewer.removeAllShapes();
    viewer.removeAllSurfaces();
    viewer.removeAllLabels();
    viewer.setStyle({}, { hidden: true });
    viewerInteractionDispatch?.({ type: "setHoveredResi", value: null });
    viewerInteractionDispatch?.({ type: "setClickedResi", value: null });
    for (const appearance of drawAppearance) {
      if (!appearance.use || appearance.use(viewerState)) {
        applyAppearance(appearance);
      }
    }
    onDraw?.(viewerState);
    viewer.render();
  }, [viewerState]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
     
      {/* track */}
      {trackColor && <ViewerTrack trackColor={trackColor} />}
     
      {/* viewer */}
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
          <Usage instructions={usage} />

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
    </Box>
  );
}