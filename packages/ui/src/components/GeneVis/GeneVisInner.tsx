// import { useState, Fragment} from "react";
import {
  GenTrack,
  useGenTrackState,
  useGenTrackTooltipDispatch,
  useGenTrackTooltipState
} from "ui";
import { Box } from "@mui/material";
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
  const tracks = [];
  
  // add gene track
  if (data.genes &&
    (fixedTracks === true || fixedTracks?.includes("genes") ||
    (zoomableTracks === true || zoomableTracks?.includes("genes")) {
    tracks.push(getGenesTrack({ geneLabel, geneColor }));
  }

  // add variants track
  if (data.variants &&
    (fixedTracks === true || fixedTracks?.includes("variants") ||
    (zoomableTracks === true || zoomableTracks?.includes("variants")) {
    tracks.push(getVariantsTrack({ variantLabel, variantColor }));
  }

  return (
    <Box sx={{mr: 3}}>
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
        paddingBottom={24}
      />
    </Box>
  );
}




export default GeneVisInner;

!!!! HERE !!!!!
how pass the chromosome to the XAxisLabel????

/*
TO DO:
- dynamic rerender of gene track only when width changes


*/