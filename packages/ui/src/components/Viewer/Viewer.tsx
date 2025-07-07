import { useEffect, useRef   } from "react";
import { useViewerState } from "./ViewerProvider";

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

!!!! HERE !!!!
- add optional props for passing components for info popup and btm-right details box

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