import { Fragment } from "react";
import { Container, Sprite, Text } from '@pixi/react';
import { TextStyle, Text as PixiText } from "pixi.js";
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
function Strip({ rectTexture, xStart, xEnd, y, height, spriteProps }) {
  return (
    <Sprite
      texture={rectTexture}
      x={xStart}
      y={y - height / 2}
      width={xEnd - xStart}
      height={height}
      {...spriteProps}
    />
  );
}

function getValue(value, arg) {
  return typeof value === "function" ? value(arg) : value;
}

function tickScaleFactory(filterActionPairs) {
  return (wrapper) => {
    objectLoop: for (const obj of wrapper.children[0].children) {
      for (const { filterFn, actionFn } of filterActionPairs) {
        if (filterFn(obj)) {
          actionFn(obj, wrapper);
          continue objectLoop;
        }
      }
    }
  };
}

export function getGenesTrack({ geneLabel, geneColor, canvasWidth = 0, pixelGap = 0, pixelGapCenterToCenter = 0 }) {
  const genTrackState = useGenTrackState(); 
  const { data, xMin, xMax } = genTrackState ?? { data: null, xMin: 0, xMax: 0 };

  const bpPerPixel = (canvasWidth > 0 && xMax > xMin) ? (xMax - xMin) / canvasWidth : 1;

  const rowHeight = 32;
  const intronHeight = 2;
  const exonHeight = 12;
  const labelHeight = rowHeight - exonHeight;

  const yTop = (rowIndex) => rowIndex * rowHeight;
  const ycenter = (rowIndex) => rowIndex * rowHeight + labelHeight + (rowHeight - labelHeight) / 2;
  const GeneToRow = packIntervals(data.genes, { bpPerPixel, pixelGap, pixelGapCenterToCenter });
  const nRows = Math.max(...Object.values(GeneToRow)) + 1;
  const trackHeight = rowHeight * nRows;

  return {
    id: "genes",
    height: trackHeight,
    paddingTop: 0,
    yMin: 0,
    yMax: trackHeight,
    // YInfo: null,
    // YInfo: () => (
    //   <Box sx={infoStyle}> 
    //     <Typography component="div" variant="caption" sx={{ fontWeight: 500 }}>
    //       Genes
    //     </Typography>
    //   </Box>
    // ),
    Track: () => {
      const rectTexture = useRectangleTexture();
      return (
        <Container>
          {data.genes.map(gene => {
            const { target } = gene;
            return (
              <Fragment key={target.id}>
                <Text  // !! USE geneLabel HERE !! - can be component??
                  text={`${target.genomicLocation.strand === -1 ? "← " : "" }${
                    target.approvedSymbol ?? target.id}${
                    target.genomicLocation.strand === 1 ? " →" : "" }`}
                  x={(target.genomicLocation.start + target.genomicLocation.end) / 2}
                  y={yTop(GeneToRow[target.id]) + labelHeight}
                  anchor={[0.5, 1]}
                  style={
                    new TextStyle({
                      align: 'center',
                      fill: "#000",
                      fontSize: 10.5,
                      fontWeight: '100',
                      wordWrap: false,
                    })
                  }
                />
                <Strip
                  rectTexture={rectTexture}
                  xStart={target.genomicLocation.start}
                  xEnd={target.genomicLocation.end}
                  y={ycenter(GeneToRow[target.id])}
                  height={intronHeight}
                  spriteProps={{ tint: getValue(geneColor, gene) }}
                />
                {target.canonicalExons?.map(exon => (
                  <Strip
                    key={`${target.id}-${exon.start}-${exon.end}`}
                    rectTexture={rectTexture}
                    xStart={exon.start}
                    xEnd={exon.end}
                    y={ycenter(GeneToRow[target.id])}
                    height={exonHeight}
                    spriteProps={{ tint: getValue(geneColor, gene) }}
                  />
                ))}
              </Fragment>
            )
          })}
        </Container>
      );
    },
    onTick: tickScaleFactory([
      {
        filterFn: obj => obj instanceof PixiText,  // look for text first as is also a sprite
        actionFn: (obj, wrapper) => {
          obj.scale.x = 1 / (wrapper.scale.x * wrapper.parent.scale.x);
          obj.scale.y = 1 / (wrapper.scale.y * wrapper.parent.scale.y);
        }
      },
      // {
      //   filterFn: obj => obj instanceof PixiSprite,
      //   actionFn: (obj, wrapper) => {
      //     obj.width = variantWidth / (wrapper.scale.x * wrapper.parent.scale.x);
      //   }
      // },
    ])
  }
}