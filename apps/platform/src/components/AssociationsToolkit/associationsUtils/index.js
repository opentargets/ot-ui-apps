import { scaleQuantize, rgb } from "d3";
import Legend from "./Legend";
import dataSources from "../static_datasets/dataSourcesAssoc";
import { getConfig } from "@ot/config";

const config = getConfig();

export const { isPartnerPreview } = config.profile;

export * from "./associations";
export * from "./interactors";

const ASSOCIATION_LEGEND_LABEL = "Association score";
const PRIORITISATION_LEGEND_LABEL = "Prioritisation indicator";
const TARGE_PRIORITISATION_LEGEND_TICKS = ["Unfavourable", "Favourable"];

export const DEFAULT_TABLE_PAGE_INDEX = 0;
export const DEFAULT_TABLE_PAGE_SIZE = 25;

export const DEFAULT_TABLE_PAGINATION_STATE = {
  pageIndex: DEFAULT_TABLE_PAGE_INDEX,
  pageSize: DEFAULT_TABLE_PAGE_SIZE,
};

export const DEFAULT_TABLE_SORTING_STATE = [{ id: "score", desc: true }];

export const DISPLAY_MODE = {
  PRIORITISATION: "prioritisations",
  ASSOCIATIONS: "associations",
};

export const TABLE_PREFIX = {
  CORE: "core",
  PINNING: "pinning",
  INTERACTORS: "interactors",
  UPLOADED: "uploaded",
};

export const ENTITIES = {
  TARGET: "target",
  EVIDENCE: "evidence",
  DISEASE: "disease",
  DRUG: "drug",
};

export const rowNameProperty = { [ENTITIES.TARGET]: "approvedSymbol", [ENTITIES.DISEASE]: "name" };

export const groupViewColumnsBy = (input, key) =>
  input.reduce((acc, currentValue) => {
    const groupKey = currentValue[key];
    const { isPrivate } = currentValue;
    if (isPrivate === false || typeof isPrivate === "undefined") {
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(currentValue);
    } else if (isPartnerPreview) {
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(currentValue);
    }
    return acc;
  }, {});

/* --- TABLE SHARED HELPERS --- */
export const getPriorisationSectionId = columnDef => columnDef.sectionId;

export const getCellId = (cell, entityToGet, displayedTable, tablePrefix = null) => {
  const colId = cell.column.id;
  const rowId = cell.row.original[entityToGet].id;
  const sectionId =
    displayedTable === DISPLAY_MODE.ASSOCIATIONS ? cell.column.id : cell.column.columnDef.sectionId;
  return [rowId, colId, sectionId, tablePrefix];
};

export const getColumAndSection = (cell, displayedTable) => {
  if (!cell.column) return [];
  const colId = cell.column.id;
  const sectionId =
    displayedTable === DISPLAY_MODE.ASSOCIATIONS ? cell.column.id : cell.column.columnDef.sectionId;
  return [colId, sectionId];
};

export const cellHasValue = score => typeof score === "number";

export const defaulDatasourcesWeigths = dataSources.map(
  ({ id, weight, required, aggregation }) => ({
    id,
    weight,
    required,
    aggregation,
    propagate: true,
  })
);

export const getWightSourceDefault = source => {
  const sourcesDetails = defaulDatasourcesWeigths.find(src => src.id === source);
  return sourcesDetails.weight;
};

export const checkBoxPayload = (id, aggregationId) => ({
  id,
  path: [aggregationId, id],
  name: "dataTypes",
});

export const getControlChecked = (values, id) => values.filter(val => val.id === id).length > 0;

/* --- CONSTANTS --- */
const { primaryColor } = config.profile;

/* Associations colors */
export const ASSOCIATION_COLORS = [
  rgb("#dbeaf6"),
  rgb("#BFDAEE"),
  rgb("#A5CAE6"),
  rgb("#8ABADE"),
  rgb("#6EA9D7"),
  rgb("#4F97CF"),
  rgb("#3583C0"),
  rgb("#2C6EA0"),
  rgb("#245780"),
];

/* PRIORITIZATION */
export const PRIORITISATION_COLORS = [
  rgb("#a01813"),
  rgb("#bc3a19"),
  rgb("#d65a1f"),
  rgb("#e08145"),
  rgb("#e3a772"),
  rgb("#e6ca9c"),
  rgb("#eceada"),
  rgb("#c5d2c1"),
  rgb("#9ebaa8"),
  rgb("#78a290"),
  rgb("#528b78"),
  rgb("#2f735f"),
  rgb("#2e5943"),
];

/* ASSOCIATION SCALE */
export const asscScaleDomain = scaleQuantize().domain([0, 1]);
export const assocScale = asscScaleDomain.range(ASSOCIATION_COLORS);

/* PRIORITISATION SCALE */
export const prioritizationScaleDomain = scaleQuantize().domain([-1, 1]);
export const prioritizationScale = prioritizationScaleDomain.range(PRIORITISATION_COLORS);

/* LEGENDS */
const PrioritisationLegend = Legend(prioritizationScale, {
  title: PRIORITISATION_LEGEND_LABEL,
  tickFormat: (d, i) =>
    [
      TARGE_PRIORITISATION_LEGEND_TICKS[0],
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      " ",
      TARGE_PRIORITISATION_LEGEND_TICKS[1],
    ][i],
});

const AssociationsLegend = Legend(assocScale, {
  title: ASSOCIATION_LEGEND_LABEL,
  tickFormat: ".1f",
});

export const getLegend = isAssoc => {
  if (isAssoc) return AssociationsLegend;
  return PrioritisationLegend;
};

/* --- GLOBAL HELPERS --- */
export const getScale = isAssoc => (isAssoc ? assocScale : prioritizationScale);

/* --- CSS VARIABLES --- */
export const tableCSSVariables = {
  "--primary-color": primaryColor,
  "--grey-lighter": "#f6f6f6",
  "--grey-light": "#ececec",
  "--grey-mid": "#e0dede",
  "--grey-dark": "#b8b8b8",
  "--background-color": "#fafafa",
  "--text-color": "#5A5F5F",
  "--table-header-min-width": "120px",
  "--table-header-max-width": "160px",
  "--table-left-column-width": "260px",
  "--row-hover-color": "var(--grey-light)",
  "--aggregations-background-color": "var(--grey-light)",
  "--aggregations-border-color": "var(--grey-dark)",
  "--header-border-color": "var(--grey-light)",
  "--entities-border-color": "var(--grey-light)",
  "--table-footer-border-color": "var(--grey-light)",
  "--colums-controls-color": "var(--grey-lighter)",
};
