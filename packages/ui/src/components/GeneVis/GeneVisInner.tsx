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
import { getGeneMinimapTrack } from "./getGeneMinimapTrack";
import { packIntervals } from "./packIntervals";

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

  const bpPerPixel = (canvasWidth > 0 && xMax > xMin) ? (xMax - xMin) / canvasWidth : 1;

  // Compute layout once — shared by minimap (top-level) and detail (zoom-level) so rows align
  const hasGenes = data.genes &&
    (fixedTracks === true || fixedTracks?.includes("genes") ||
     zoomableTracks === true || zoomableTracks?.includes("genes"));

  const geneToRow = hasGenes
    ? packIntervals(data.genes, { bpPerPixel, pixelGap: 1, pixelGapCenterToCenter: 100 })
    : null;

  const fixedTrackList = [];
  const innerTrackList = [];

  if (hasGenes) {
    fixedTrackList.push(getGeneMinimapTrack({ geneColor, geneToRow }));
    innerTrackList.push(getGenesTrack({ geneLabel, geneColor, geneToRow }));
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
        tracks={fixedTrackList}
        // InnerXInfo={XAxis}
        innerTracks={innerTrackList}
        // InnerXYInfo={XAxisLabel}
        yInfoGap={8}
        yInfoWidth={40}
        zoomLines
        panZoomTopGap={0}
        paddingBottom={4}
      />
    </Box>
  );
}

export default GeneVisInner;