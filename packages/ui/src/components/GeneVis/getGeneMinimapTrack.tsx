import { Container } from '@pixi/react';
import { DataSprite } from "../GenTrack";
import { useGenTrackState } from "ui";
import type { RefObject } from "react";
import type { ScalesRef } from "../GenTrack/ScalesContext";

function getValue(value, arg) {
  return typeof value === "function" ? value(arg) : value;
}

const ROW_HEIGHT = 7;
const BAR_HEIGHT = 4;
const BAR_PADDING_TOP = 1;

export function getGeneMinimapTrack({ geneColor, geneToRow }) {
  const genTrackState = useGenTrackState();
  const { data } = genTrackState ?? { data: null };

  const nRows = Math.max(...Object.values(geneToRow)) + 1;
  const trackHeight = ROW_HEIGHT * nRows;

  return {
    id: "genes-minimap",
    height: trackHeight,
    paddingTop: 4,
    yMin: 0,
    yMax: trackHeight,
    Track: ({ trackId, scalesRef }: { trackId: string; isInner: boolean; scalesRef: RefObject<ScalesRef> }) => {
      return (
        <Container>
          {data.genes.map(gene => {
            const { target } = gene;
            const rowIndex = geneToRow[target.id];
            const tint = getValue(geneColor, target);
            return (
              <DataSprite
                key={target.id}
                scalesRef={scalesRef}
                trackId={trackId}
                x={target.genomicLocation.start}
                y={rowIndex * ROW_HEIGHT + BAR_PADDING_TOP}
                width={target.genomicLocation.end - target.genomicLocation.start}
                height={BAR_HEIGHT}
                tint={tint}
                minPixelWidth={2}
              />
            );
          })}
        </Container>
      );
    },
  };
}
