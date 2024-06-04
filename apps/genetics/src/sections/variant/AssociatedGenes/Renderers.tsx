import React from "react";
import { max, scaleSqrt } from "d3";
import { DataCircle, Link } from "../../../ot-ui-components";
import LabelHML from "../../../components/LabelHML";

import { generateComparator, commaSeparate, safeCommaSeparate } from "../../../utils";

import {
  radiusScale,
  GeneForVariantDataRow,
  isDistanceElement,
  isDistanceTissue,
  isQtlElement,
  isFunctionalPredictionElement,
} from "./utils";
import { G2VSchema, G2VSchemaElement, GeneForVariant } from "../../../__generated__/graphql";

export const createDistanceCellRenderer = (schemaElement: G2VSchemaElement) => {
  return (rowData: GeneForVariantDataRow) => {
    const distanceData = rowData[schemaElement.sourceId];
    if (distanceData !== undefined && isDistanceElement(distanceData)) {
      const { distance } = distanceData.tissues[0];
      return <>{safeCommaSeparate(distance)}</>;
    }
  };
};

export const createDistanceAggregateCellRenderer = (_schemaElement: G2VSchemaElement) => {
  return (rowData: GeneForVariantDataRow) => {
    if (rowData.aggregated && isDistanceTissue(rowData.aggregated)) {
      const { distance } = rowData.aggregated;
      return <>{distance ? commaSeparate(distance) : null}</>;
    } else {
      return null;
    }
  };
};

export const createQtlCellRenderer = (schemaElement: G2VSchemaElement) => {
  return (rowData: GeneForVariantDataRow) => {
    const val = rowData[schemaElement.sourceId];
    if (typeof val === "number") {
      const circleRadius = radiusScale(val);
      return <DataCircle radius={circleRadius} colorScheme="default" />;
    }
  };
};

export const createAggregateCellRenderer = (_schemaElement: G2VSchemaElement) => {
  return (rowData: GeneForVariantDataRow) => {
    if (rowData.aggregated && isQtlElement(rowData.aggregated)) {
      const circleRadius = radiusScale(rowData.aggregated.aggregatedScore);
      return <DataCircle radius={circleRadius} colorScheme="default" />;
    } else {
      return null;
    }
  };
};

export const createIntervalCellRenderer = (schemaElement: G2VSchemaElement) => {
  return (rowData: GeneForVariantDataRow) => {
    const val = rowData[schemaElement.sourceId];
    if (typeof val === "number") {
      const circleRadius = radiusScale(val);
      return <DataCircle radius={circleRadius} colorScheme="default" />;
    }
  };
};

export const createFPCellRenderer = (schemaElement: G2VSchemaElement) => {
  return (rowData: GeneForVariantDataRow) => {
    const fpData = rowData[schemaElement.sourceId];
    if (isFunctionalPredictionElement(fpData)) {
      const { maxEffectLabel, maxEffectScore } = fpData.tissues[0];
      if (!maxEffectLabel || !maxEffectScore) {
        return null;
      }
      const level =
        0 <= maxEffectScore && maxEffectScore <= 1 / 3
          ? "L"
          : 1 / 3 < maxEffectScore && maxEffectScore <= 2 / 3
          ? "M"
          : "H";
      return <LabelHML level={level}>{maxEffectLabel}</LabelHML>;
    }
  };
};

export const createFPAggregateCellRenderer = (_schemaElement: G2VSchemaElement) => {
  return (rowData: GeneForVariantDataRow) => {
    const fpData = rowData.aggregated;
    if (isFunctionalPredictionElement(fpData)) {
      const { maxEffectLabel, maxEffectScore } = fpData.tissues[0];
      if (!maxEffectLabel || !maxEffectScore) {
        return null;
      }
      const level =
        0 <= maxEffectScore && maxEffectScore <= 1 / 3
          ? "L"
          : 1 / 3 < maxEffectScore && maxEffectScore <= 2 / 3
          ? "M"
          : "H";
      return <LabelHML level={level}>{maxEffectLabel}</LabelHML>;
    }
  };
};

export const getColumnsAll = (
  genesForVariantSchema: G2VSchema,
  genesForVariant: GeneForVariant[]
) => {
  const maxOverallScore = max(genesForVariant, geneForVariant => geneForVariant.overallScore) ?? 0;
  const overallScoreScale = scaleSqrt().domain([0, maxOverallScore]).range([0, 6]);
  const columns = [
    {
      id: "geneSymbol",
      label: "Gene",
      renderCell: (rowData: GeneForVariantDataRow) => {
        return <Link to={`/gene/${rowData.geneId}`}>{rowData.geneSymbol}</Link>;
      },
    },
    {
      id: "overallScore",
      label: "Overall V2G",
      renderCell: (rowData: GeneForVariantDataRow) => {
        const circleRadius = overallScoreScale(rowData.overallScore);
        return <DataCircle radius={circleRadius} colorScheme="bold" />;
      },
    },
    ...genesForVariantSchema.distances.map((schemaElement: G2VSchemaElement) => ({
      id: schemaElement.sourceId,
      label: schemaElement.sourceLabel,
      tooltip: schemaElement.sourceDescriptionOverview,
      renderCell: createDistanceCellRenderer(schemaElement),
      comparator: generateComparator((d: GeneForVariantDataRow) => {
        const e = d[schemaElement.sourceId];
        e && isDistanceElement(e) && e.tissues[0].distance ? e.tissues[0].distance : null;
      }),
    })),
    ...genesForVariantSchema.qtls.map(schema => ({
      id: schema.sourceId,
      label: schema.sourceLabel,
      tooltip: schema.sourceDescriptionOverview,
      renderCell: createQtlCellRenderer(schema),
    })),
    ...genesForVariantSchema.intervals.map(schema => ({
      id: schema.sourceId,
      label: schema.sourceLabel,
      tooltip: schema.sourceDescriptionOverview,
      renderCell: createIntervalCellRenderer(schema),
    })),
    ...genesForVariantSchema.functionalPredictions.map(schema => ({
      id: schema.sourceId,
      label: schema.sourceLabel,
      tooltip: schema.sourceDescriptionOverview,
      renderCell: createFPCellRenderer(schema),
    })),
  ];

  return columns;
};
