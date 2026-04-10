import { GenTrackProvider, GenTrackTooltipProvider } from "ui";
import BodyContentInner from "./BodyContentInner";

function GeneVis({
  data,
  chromosome,
  xMin,
  xMax,
  geneAxisLabel = "Genes",
  variantAxisLabel = "Varants",
  geneLabel = (gene => gene.approvedSymbol),
  geneColor,
  variantColor,
  fixedTracks = true,
  zoomableTracks = true,
}) {

  return (
    <GenTrackProvider initialState={{ data, xMin, xMax }} >
      <GenTrackTooltipProvider >
        <BodyContentInner
          chromosome={chromosome}
          geneAxisLabel={geneAxisLabel}
          variantsLabel={variantAxisLabel}
          geneLabel={geneLabel}
          geneColor={geneColor}
          variantColor={variantColor}
          fixedTracks={fixedTracks}
          zoomableTracks={zoomableTracks}
        />
      </GenTrackTooltipProvider>
    </GenTrackProvider>
  );

}

export default GeneVis;