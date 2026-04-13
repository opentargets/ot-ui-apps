import { Fragment } from "react";
import { Sprite, Text } from '@pixi/react';
import { TextStyle } from "pixi.js";
import { Box, Typography } from "@mui/material";
import { useRectangleTexture } from "../GenTrack/shapes";
import { packIntervals } from "./packIntervals";
import { infoStyle } from "./helpers";
import {
  useGenTrackState,
  // useGenTrackTooltipDispatch,
  // useGenTrackTooltipState
} from "ui";

// horizontal strip, y prop is the y-center
function Strip({ rectTexture, xStart, xEnd, yStart, height, spriteProps }) {
  return (
    <Sprite
      texture={rectTexture}
      x={xStart}
      y={yStart}
      width={xEnd - xStart}
      height={height}
      {...spriteProps}
    />
  );
}

export function getGenesTrack({ geneLabel, geneColor, canvasWidth = 0, pixelGap = 0, pixelGapStartToStart = 0 }) {
  const genTrackState = useGenTrackState(); 
  const { data, xMin, xMax } = genTrackState ?? { data: null, xMin: 0, xMax: 0 };

  const bpPerPixel = (canvasWidth > 0 && xMax > xMin) ? (xMax - xMin) / canvasWidth : 1;

  const rowHeight = 30;
  // const rowGap = 10;
  const labelHeight = 12;
  const GeneToRow = packIntervals(data.genes, { bpPerPixel, pixelGap, pixelGapStartToStart });
  const nRows = Math.max(...Object.values(GeneToRow)) + 1;
  const trackHeight = rowHeight * nRows;

  console.log(GeneToRow)
  // console.log(trackHeight);

!!!! NOW !!!1
- switch back to strips use yCenter since easier for showing introns + exons + UTC
- color by coding versus non-coding
  - and highlight if score and show score

  return {
    id: "genes",
    height: trackHeight,
    paddingTop: 0,
    yMin: 0,
    yMax: trackHeight,
    YInfo: () => (
      <Box sx={infoStyle}> 
        <Typography component="div" variant="caption" sx={{ fontWeight: 500 }}>
          Genes
        </Typography>
      </Box>
    ),
    Track: () => {
      const rectTexture = useRectangleTexture();
      return (
        <Fragment>
          {data.genes.map(({ target }) => {
            const { start, end } = target.genomicLocation;
            // console.log({start, end});
            // debugger
            return (
              <Fragment key={target.id}>
                {/* <Text
                  text={target.approvedSymbol ?? target.id}  // !! USE geneLabel HERE !! - can be component?
                  x={start}
                  y={0}
                  anchor={[0, 0]}
                  style={
                    new TextStyle({
                      align: 'center',
                      fill: "#000",
                      fontSize: 11,
                      fontWeight: '100',
                      wordWrap: false,
                    })
                  }
                /> */}
                <Strip
                  rectTexture={rectTexture}
                  // start={9_300_000}
                  // end={9_700_000}
                  xStart={start}
                  xEnd={end}
                  // yStart={0}
                  yStart={GeneToRow[target.id] * rowHeight + labelHeight}
                  height={16}
                  spriteProps={{ tint: geneColor }}  // !! NEED TO ALLOW FOR FUNCTION !!
                />
              </Fragment>
            )
          })}
        </Fragment>
      );
    },
  }
}