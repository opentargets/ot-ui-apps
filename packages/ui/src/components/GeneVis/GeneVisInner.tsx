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
import YDetails from "./YDetails";
import { getGenesTracks } from "./getGenesTracks";
import { getGeneMinimapTracks } from "./getGeneMinimapTracks";
import { getVariantTrack } from "./getVariantTrack";
import { packIntervals } from "./packIntervals";
import UnifiedTooltip from "./UnifiedTooltip";

const BIOTYPE_COLORS = {
  protein_coding: "#2e5943",
  processed_transcript: "#ff7f0e",
  pseudogene: "#1f77b4",
  rna: "#9467bd",
  other: "#d62728",
};

const BIOTYPE_DIM_COLORS = {
  protein_coding: "#709a88",
  processed_transcript: "#e49a50",  // !! MAKE ALL NON-CODING QUITE BOLD FOR NOW !!
  pseudogene: "#6d9ccb",
  rna: "#946ece",
  other: "#c84a4a",
};

const BIOTYPE_DISPLAY_NAMES = {
  protein_coding: "Protein coding",
  processed_transcript: "Processed transcript",
  pseudogene: "Pseudogene",
  rna: "RNA",
  other: "Other",
};

const BIOTYPE_ORDER = ["protein_coding", "rna", "pseudogene", "processed_transcript", "other"];

function groupTargetsByBiotype(targets) {
  return Object.groupBy(targets, gene => {
    const b = gene.target.biotype.toLowerCase();
    if (b === "protein_coding") return "protein_coding";
    if (b === "processed_transcript") return "processed_transcript";
    if (b.includes("pseudogene")) return "pseudogene";
    if (b.includes("rna")) return "rna";
    return "other";
  });
}

function GeneVisInner({
  geneLabel,
  fixedTracks,
  zoomableTracks,
}) {

  const genTrackState = useGenTrackState();
  const { data, xMin, xMax } = genTrackState;

  // Extract L2G prediction gene IDs for priority packing
  const l2gGeneIds = new Set(
    data?.l2GPredictions?.rows?.map(row => row.target.id) || []
  );

  // Per-biotype track configuration
  const getBiotypeConfig = (hasLabels: boolean) => {
    return {
      pixelGapCenterToCenter: hasLabels ? 100 : 0,
      detailRowHeight: hasLabels ? 32 : 16, // 32 with labels, 16 without
    };
  };

  const Y_INFO_WIDTH = 150;
  const Y_INFO_GAP = 0;
  const [widthRef, { width: totalWidth }] = useMeasure();
  const canvasWidth = (totalWidth ?? 0) - Y_INFO_WIDTH - Y_INFO_GAP;

  const bpPerPixel = (canvasWidth > 0 && xMax > xMin) ? (xMax - xMin) / canvasWidth : 1;

  // Check if we have gene data
  const hasGenes = data?.region?.targets?.length &&
    (fixedTracks === true || fixedTracks?.includes("genes") ||
     zoomableTracks === true || zoomableTracks?.includes("genes"));

  const fixedTrackList = [];
  const innerTrackList = [];

  // variant track
  const variantTrack = getVariantTrack({ data });
  fixedTrackList.push(variantTrack);
  innerTrackList.push(variantTrack);
 
  // gene tracks
  if (hasGenes) {
    // Group genes by biotype
    const groupedTargets = groupTargetsByBiotype(data.region.targets);

    // Create tracks for each biotype that has genes
    for (const biotype of BIOTYPE_ORDER) {
      const targets = groupedTargets[biotype];
      if (!targets || targets.length === 0) continue;

      const color = (BIOTYPE_COLORS as Record<string,string>)[biotype];
      const dimColor = (BIOTYPE_DIM_COLORS as Record<string,string>)[biotype] ?? color;

      // YInfo component for this biotype
      const TrackYInfo = () => (
        <YDetails
          SubLabel={BIOTYPE_DISPLAY_NAMES[biotype]}
          Axis={null}
        />
      );

      // ===== MINIMAP TRACK (top level) =====
      // Only L2G genes get labels in minimap
      const minimapLabeledIds = new Set(
        targets.filter(g => l2gGeneIds.has(g.target.id)).map(g => g.target.id)
      );
      const minimapConfig = getBiotypeConfig(minimapLabeledIds.size > 0);
      const minimapPriorityIds = Array.from(minimapLabeledIds) as string[];

      // Compute packing for minimap
      const minimapGeneToRow = packIntervals(targets, {
        bpPerPixel,
        pixelGap: 1,
        pixelGapCenterToCenter: minimapConfig.pixelGapCenterToCenter,
        priorityIds: minimapPriorityIds,
        labeledIds: Array.from(minimapLabeledIds),
      });

      // Build minimap row heights
      const minimapRowsWithLabels = new Set<number>();
      for (const gene of targets) {
        const row = minimapGeneToRow[gene.target.id];
        if (row !== undefined && minimapLabeledIds.has(gene.target.id)) {
          minimapRowsWithLabels.add(row);
        }
      }

      const minimapNRows = Math.max(...Object.values(minimapGeneToRow).map((v: unknown) => Number(v))) + 1;
      const minimapRowHeightMap: number[] = [];
      const minimapRowYOffsets: number[] = [];
      let minimapCurrentYOffset = biotype === "protein_coding" ? 5 : 0;
      const minimapTallHeight = 22; // Taller rows for labeled genes (label + bigger bar)
      const minimapShortHeight = 12; // Shorter rows for unlabeled genes

      for (let r = 0; r < minimapNRows; r++) {
        const rowHasLabels = minimapRowsWithLabels.has(r);
        const rowHeight = rowHasLabels ? minimapTallHeight : minimapShortHeight;
        minimapRowHeightMap[r] = rowHeight;
        minimapRowYOffsets[r] = minimapCurrentYOffset;
        minimapCurrentYOffset += rowHeight;
      }
      const minimapTrackHeight = minimapCurrentYOffset;
      const minimapFinalTrackHeight = Math.max(minimapTrackHeight, 20);
      const minimapPadding = biotype === "protein_coding" ? 16 : 8; // Larger gap after variant track

      // Add minimap track with variable row heights
      fixedTrackList.push(getGeneMinimapTracks({
        geneToRow: minimapGeneToRow,
        color,
        biotype,
        id: `genes-minimap-${biotype}`,
        YInfo: TrackYInfo,
        rowHeightMap: minimapRowHeightMap,
        rowYOffsets: minimapRowYOffsets,
        trackHeight: minimapFinalTrackHeight,
        paddingTop: minimapPadding,
        labeledIds: minimapLabeledIds,
        dimColor,
        highlightIds: new Set(l2gGeneIds),
      }));

      // ===== ZOOMABLE TRACK (detail level) =====
      // Only protein-coding genes get labels in zoomable view
      const zoomableLabeledIds = biotype === "protein_coding"
        ? new Set<string>(targets.map((g: { target: { id: string } }) => g.target.id))
        : new Set<string>();
      const zoomableConfig = getBiotypeConfig(true); // Always has labels
      const zoomablePriorityIds = Array.from(
        targets.filter((g: { target: { id: string } }) => l2gGeneIds.has(g.target.id)).map((g: { target: { id: string } }) => g.target.id)
      ) as string[];

      // Compute packing for zoomable track
      const zoomableGeneToRow = packIntervals(targets, {
        bpPerPixel,
        pixelGap: 1,
        pixelGapCenterToCenter: zoomableConfig.pixelGapCenterToCenter,
        priorityIds: zoomablePriorityIds,
        labeledIds: Array.from(zoomableLabeledIds),
      });

      // Build zoomable row heights
      const zoomableRowsWithLabels = new Set<number>();
      for (const gene of targets) {
        const row = zoomableGeneToRow[gene.target.id];
        if (row !== undefined && zoomableLabeledIds.has(gene.target.id)) {
          zoomableRowsWithLabels.add(row);
        }
      }

      const zoomableNRows = Math.max(...Object.values(zoomableGeneToRow).map((v: unknown) => Number(v))) + 1;
      const zoomableRowHeightMap: number[] = [];
      const zoomableRowYOffsets: number[] = [];
      let zoomableCurrentYOffset = 0;
      const zoomableTallHeight = zoomableConfig.detailRowHeight;
      const zoomableShortHeight = Math.max(16, zoomableTallHeight / 2 + 2);

      for (let r = 0; r < zoomableNRows; r++) {
        const rowHasLabels = zoomableRowsWithLabels.has(r);
        const rowHeight = rowHasLabels ? zoomableTallHeight : zoomableShortHeight;
        zoomableRowHeightMap[r] = rowHeight;
        zoomableRowYOffsets[r] = zoomableCurrentYOffset;
        zoomableCurrentYOffset += rowHeight;
      }
      const zoomableTrackHeight = zoomableCurrentYOffset;
      const zoomableFinalTrackHeight = Math.max(zoomableTrackHeight, 20);
      const zoomablePadding = biotype === "protein_coding" ? 16 : Math.max(8, (20 - zoomableTrackHeight) / 2);

      // Add zoomable detail track
      innerTrackList.push(getGenesTracks({
        geneLabel,
        geneToRow: zoomableGeneToRow,
        color,
        biotype,
        id: `genes-${biotype}`,
        YInfo: TrackYInfo,
        rowHeightMap: zoomableRowHeightMap,
        rowYOffsets: zoomableRowYOffsets,
        trackHeight: zoomableFinalTrackHeight,
        paddingTop: zoomablePadding,
        labeledIds: zoomableLabeledIds,
        dimColor,
        highlightIds: new Set(l2gGeneIds),
      }));
    }
  }

  return (
    <Box ref={widthRef} sx={{mr: 3}}>
      <GenTrack
        XInfo={XAxis}
        XYInfo={XAxisLabel}
        // tracks={fixedTrackList}
        // InnerXInfo={XAxis}
        innerTracks={innerTrackList}
        // InnerXYInfo={XAxisLabel}
        yInfoGap={Y_INFO_GAP}
        yInfoWidth={Y_INFO_WIDTH}
        zoomLines
        panZoomTopGap={0}
        panZoomBottomGap={4}
        paddingBottom={8}
        Tooltip={UnifiedTooltip}
        InnerTooltip={UnifiedTooltip}
      />
    </Box>
  );
}

export default GeneVisInner;