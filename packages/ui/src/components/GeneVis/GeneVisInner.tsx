// import { useState, Fragment} from "react";
import {
  GenTrack,
  useGenTrackState,
  useGenTrackTooltipDispatch,
  useGenTrackTooltipState
} from "ui";
import { Box } from "@mui/material";
import { useMeasure } from "@uidotdev/usehooks";
import XAxis from "./XAxis";
import XAxisLabel from "./XAxisLabel";
import { getGenesTrack } from "./getGenesTrack";

function GeneVisInner({
  chromosome,
  geneAxisLabel,
  variantAxisLabel,
  geneLabel,
  geneColor,
  variantColor,
  fixedTracks,
  zoomableTracks,
}) {

  const genTrackState = useGenTrackState();
  const { data, xMin, xMax } = genTrackState;

  const Y_INFO_WIDTH = 180;
  const Y_INFO_GAP = 8;
  const [widthRef, { width: totalWidth }] = useMeasure();
  const canvasWidth = (totalWidth ?? 0) - Y_INFO_WIDTH - Y_INFO_GAP;

  const tracks = [];
  
  // add gene track
  if (data.genes &&
    (fixedTracks === true || fixedTracks?.includes("genes") ||
     zoomableTracks === true || zoomableTracks?.includes("genes"))) {
    tracks.push(getGenesTrack({
      geneLabel,
      geneColor,
      canvasWidth,
      pixelGap: 1,
      pixelGapCenterToCenter: 100,
    }));
  }

  // add variants track
  // if (data.variants &&
  //   (fixedTracks === true || fixedTracks?.includes("variants") ||
  //    zoomableTracks === true || zoomableTracks?.includes("variants"))) {
  //   tracks.push(getVariantsTrack({ variantLabel, variantColor }));
  // }

  return (
    <Box ref={widthRef} sx={{mr: 3}}>
      <GenTrack
        XInfo={XAxis}
        XYInfo={XAxisLabel}
        tracks={tracks}
        InnerXInfo={XAxis}
        innerTracks={tracks}
        InnerXYInfo={XAxisLabel}
        yInfoGap={8}
        yInfoWidth={180}
        zoomLines
        panZoomTopGap={0}
        paddingBottom={12}
      />
    </Box>
  );
}

export default GeneVisInner;

/*
TO DO:
- dynamic rerender of gene track only when width changes
  - recompute packing when the width changes - since computes min-pixels gaps
    based on window/container width
- API
  - should we allow filtering by biotype? - if there are biotypes we definitely
    will not show - which biotypes do we want to show?! - which will actually come from the API?
- Check that axis always smooth updating when pan-zoom. Looks same as when
  'nice ticks' was preventing this in earlier experiments
- how deal with genes that overlap the window boundaries? Cut them off or show part of them?
  - cannot extend window to fit them since then just get new overlapping genes with the new window ...
  - use blur or similar to incicate there is unshown/cutoff content?
*/