import { scaleSqrt } from "d3";
import {
  DistanceElement,
  FunctionalPredictionElement,
  GeneForVariant,
} from "../../../__generated__/graphql";

export const OVERVIEW = "overview";

export const radiusScale = scaleSqrt().domain([0, 1]).range([0, 6]);

export type GeneForVariantDataRowType =
  | DistanceElement
  | FunctionalPredictionElement
  | number
  | string;
export type GeneForVariantDataRow = {
  geneId: string;
  geneSymbol: string;
  overallScore: number;
  [key: string]: GeneForVariantDataRowType;
};

export const getDataAll = (genesForVariant: GeneForVariant[]) => {
  const data = [] as GeneForVariantDataRow[];
  genesForVariant.forEach(item => {
    const row: GeneForVariantDataRow = {
      geneId: item.gene.id,
      geneSymbol: item.gene.symbol || "",
      overallScore: item.overallScore,
    };
    // for distances we want to use the first element of
    // the distances array
    item.distances.forEach(distance => {
      row[distance.sourceId] = item.distances[0];
    });
    item.qtls.forEach(qtl => {
      row[qtl.sourceId] = qtl.aggregatedScore;
    });
    item.intervals.forEach(interval => {
      row[interval.sourceId] = interval.aggregatedScore;
    });
    // for functionalPredictions we want to use the first element of
    // the functionalPredictions array
    item.functionalPredictions.forEach(fp => {
      row[fp.sourceId] = item.functionalPredictions[0];
    });
    data.push(row);
  });
  return data;
};

export const getDataAllDownload = (tableData: GeneForVariantDataRow[]) => {
  return tableData.map(row => {
    const newRow = { ...row };
    if (row.canonical_tss && isDistanceElement(row.canonical_tss)) {
      newRow.canonical_tss = row.canonical_tss.tissues[0].distance || "";
    }
    if (row.vep && isFunctionalPredictionElement(row.vep)) {
      newRow.vep = row.vep.tissues[0].maxEffectLabel || "";
    }
    return newRow;
  });
};

export const isDisabledColumn = (allData: GeneForVariantDataRow[], sourceId: string) => {
  return !allData.some(d => d[sourceId]);
};

/** Type Guards */

export const isDistanceElement = (
  element: GeneForVariantDataRowType
): element is DistanceElement => {
  const e = element as DistanceElement;
  if (e.tissues) {
    return e.tissues.length > 0 ? e.tissues[0].distance !== undefined : true;
  }
  return false;
};

export const isFunctionalPredictionElement = (
  element: GeneForVariantDataRowType
): element is FunctionalPredictionElement => {
  const e = element as FunctionalPredictionElement;
  if (e.tissues) {
    return e.tissues.length > 0 ? e.tissues[0].maxEffectLabel !== undefined : true;
  }
  return false;
};
