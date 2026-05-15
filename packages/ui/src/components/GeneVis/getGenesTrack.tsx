import { Fragment } from "react";
import { Container } from '@pixi/react';
import { TextStyle } from "pixi.js";
import { DataSprite, DataText } from "../GenTrack";
import { useGenTrackState } from "ui";
import type { RefObject } from "react";
import type { ScalesRef } from "../GenTrack/ScalesContext";

const geneLabelStyle = new TextStyle({
  align: 'center',
  fill: "#000",
  fontSize: 10.5,
  fontWeight: '100',
  wordWrap: false,
});

const DEFAULT_ROW_HEIGHT = 28;
const DEFAULT_EXON_HEIGHT = 10;

export function getGenesTrack({
    geneLabel,
    geneToRow,
    color,
    biotype,
    id,
    YInfo,
    rowHeight = DEFAULT_ROW_HEIGHT,
    rowHeightMap,
    rowYOffsets,
    trackHeight: explicitTrackHeight,
    paddingTop: explicitPaddingTop,
    labeledIds = new Set(),
    dimColor,
    highlightIds = new Set()
  }) {
  const genTrackState = useGenTrackState();
  const { data } = genTrackState ?? { data: null };

  // Look up targets from pre-grouped data in context
  const targets = data?.region?.groupedTargets?.[biotype] ?? [];

  // Check if using variable row heights (new mode) or fixed row height (legacy mode)
  const useVariableHeights = rowHeightMap !== undefined && rowYOffsets !== undefined;

  // All gene types should have same visual appearance in zoom-level view
  // Exon/intron heights are consistent regardless of biotype
  const intronHeight = 2;
  const baseRowHeight = useVariableHeights ? rowHeightMap[0] || 28 : rowHeight;
  // Standard exon height for all biotypes - consistent visual appearance
  const exonHeight = DEFAULT_EXON_HEIGHT; // 10px for all gene types
  // Labels only shown for L2G genes (protein_coding only)
  const hasAnyLabels = labeledIds.size > 0;
  const labelHeight = hasAnyLabels ? baseRowHeight - exonHeight : 0;

  // Y-position functions: use variable offsets if provided, otherwise calculate from row index
  const yTop = (rowIndex: number) => {
    if (useVariableHeights) {
      return rowYOffsets[rowIndex] ?? rowIndex * baseRowHeight;
    }
    return rowIndex * rowHeight;
  };

  // Center the gene bar vertically in the available space (below label if labels shown)
  const ycenter = (rowIndex: number) => {
    const rowStart = yTop(rowIndex);
    const currentRowHeight = useVariableHeights ? (rowHeightMap[rowIndex] || baseRowHeight) : rowHeight;
    if (hasAnyLabels && labeledIds.size > 0) {
      // If this specific row has labels, position below label area
      const rowHasLabels = targets.some(g => geneToRow[g.target.id] === rowIndex && labeledIds.has(g.target.id));
      if (rowHasLabels) {
        // Label takes space at top, center gene in remaining space below
        // But shift slightly up to visually balance with label text above
        return rowStart + labelHeight + (currentRowHeight - labelHeight) / 2 - 1;
      }
    }
    // For non-labeled rows, center in the row but shift up slightly for visual balance
    return rowStart + currentRowHeight / 2 - 1;
  };

  // Calculate track height
  const nRows = Math.max(...Object.values(geneToRow)) + 1;
  const trackHeight = explicitTrackHeight ?? (useVariableHeights
    ? (rowYOffsets[nRows - 1] + rowHeightMap[nRows - 1])
    : rowHeight * nRows);
  const paddingTop = explicitPaddingTop ?? 0;

  return {
    id: id || "genes",
    height: trackHeight,
    paddingTop,
    yMin: 0,
    yMax: trackHeight,
    YInfo,
    // Pass row metadata for potential use by the container
    rowHeightMap,
    rowYOffsets,
    Track: ({ trackId, scalesRef }: { trackId: string; isInner: boolean; scalesRef: RefObject<ScalesRef> }) => {
      return (
        <Container>
          {targets.map(gene => {
            const { target } = gene;
            const rowIndex = geneToRow[target.id];
            if (rowIndex === undefined) return null;
            // Only show label if this specific gene is in the labeledIds set
            const showGeneLabel = labeledIds.has(target.id);

            const isDimmed = dimColor && highlightIds.size > 0 && !highlightIds.has(target.id);
            const geneColor = isDimmed ? dimColor : color;
            return (
              <Fragment key={target.id}>
                {showGeneLabel && (
                  <DataText
                    scalesRef={scalesRef}
                    trackId={trackId}
                    x={(target.genomicLocation.start + target.genomicLocation.end) / 2}
                    y={yTop(rowIndex) + labelHeight}
                    text={geneLabel(target)}
                    anchor={[0.5, 1]}
                    style={geneLabelStyle}
                  />
                )}
                <DataSprite
                  scalesRef={scalesRef}
                  trackId={trackId}
                  x={target.genomicLocation.start}
                  y={ycenter(rowIndex) - intronHeight / 2}
                  width={target.genomicLocation.end - target.genomicLocation.start}
                  height={intronHeight}
                  tint={geneColor}
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
                    tint={geneColor}
                    minPixelWidth={2}
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