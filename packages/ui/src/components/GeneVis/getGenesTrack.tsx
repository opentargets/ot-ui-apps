import { Fragment } from "react";
import { Container } from '@pixi/react';
import { TextStyle } from "pixi.js";
import { DataSprite, DataText } from "../GenTrack";
import { packIntervals } from "./packIntervals";
import { useGenTrackState } from "ui";
import type { RefObject } from "react";
import type { ScalesRef } from "../GenTrack/ScalesContext";

function getValue(value, arg) {
  return typeof value === "function" ? value(arg) : value;
}

const geneLabelStyle = new TextStyle({
  align: 'center',
  fill: "#000",
  fontSize: 10.5,
  fontWeight: '100',
  wordWrap: false,
});

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
    Track: ({ trackId, scalesRef }: { trackId: string; isInner: boolean; scalesRef: RefObject<ScalesRef> }) => {
      return (
        <Container>
          {data.genes.map(gene => {
            const { target } = gene;
            const rowIndex = GeneToRow[target.id];
            const tint = getValue(geneColor, target);
            return (
              <Fragment key={target.id}>
                <DataText
                  scalesRef={scalesRef}
                  trackId={trackId}
                  x={(target.genomicLocation.start + target.genomicLocation.end) / 2}
                  y={yTop(rowIndex) + labelHeight}
                  text={geneLabel(target)}
                  anchor={[0.5, 1]}
                  style={geneLabelStyle}
                />
                <DataSprite
                  scalesRef={scalesRef}
                  trackId={trackId}
                  x={target.genomicLocation.start}
                  y={ycenter(rowIndex) - intronHeight / 2}
                  width={target.genomicLocation.end - target.genomicLocation.start}
                  height={intronHeight}
                  tint={tint}
                />
                {target.canonicalExons?.map(exon => (
                  <DataSprite
                    key={`${target.id}-${exon.start}-${exon.end}`}
                    scalesRef={scalesRef}
                    trackId={trackId}
                    x={exon.start}
                    y={ycenter(rowIndex) - exonHeight / 2}
                    width={exon.end - exon.start}
                    height={exonHeight}
                    tint={tint}
                    minPixelWidth={1}
                  />
                ))}
              </Fragment>
            );
          })}
        </Container>
      );
    },
  }
}