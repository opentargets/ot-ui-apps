import { Fragment } from "react";
import { Sprite, Text } from '@pixi/react';
import { useRectangleTexture } from "../GenTrack/shapes";
import {
  useGenTrackState,
  // useGenTrackTooltipDispatch,
  // useGenTrackTooltipState
} from "ui";

// horizontal strip, y prop is the y-center
function Strip({ rectTexture, start, end, y, height, spriteProps }) {
  return (
    <Sprite
      texture={rectTexture}
      x={start}
      y={y - height / 2}
      width={end - start}
      {...spriteProps}
    />
  );
}

export function getGenesTrack({ geneLabel, geneColor }) {
  const rectTexture = useRectangleTexture();
  const genTrackState = useGenTrackState(); 
  const data = genTrackState;

  const rowHeight = 30;
  const rowGap = 10;
  const labelHeight = 12;
  const GeneToRow = packIntervals(data.genes);
  const nRows = max(Object.values(GeneToRow)) + 1;
  const trackHeight = rowHeight * nRows + rowGap * (nRows - 1);

  return {
    id: "genes",
    height: trackHeight,
    paddingTop: 16,
    yMin: 0,
    yMax: trackHeight,
    YInfo: () => (
      <Box sx={infoStyle}> 
        <Typography component="div" variant="caption" sx={{ fontWeight: 500 }}>
          Genes
        </Typography>
      </Box>
    ),
    Track: () => (
      <Fragment>
        {data.genes.map(({ target }) => {
          const { start, end } = target.genomicLocation;
          const yStripCenter = labelHeight + (rowHeight - labelHeight) / 2;
          return (
            <Fragment key={target.id}>
              <Text
                text={target.approvedSymbol}  // !! USE geneLabel HERE !! - can be component?
                x={start}
                y={0}
                anchor={[0, 0]}
                style={
                  new TextStyle({
                    align: 'center',
                    fill: labelColor,
                    fontSize: 11,
                    fontWeight: '100',
                    wordWrap: false,
                  })
                }
              />
              <Strip
                rectTexture={rectTexture}
                start={start}
                end={end}
                y={yStripCenter}
                height={20}
              />
            </Fragment>
          )
        })}
      </Fragment>
    ),
  }
}