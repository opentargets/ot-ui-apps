import { scaleQuantize, rgb } from 'd3';

/* Exoport Legend */
export { default as Legend } from './Legend';

/* --- TABLE SHARED HELPERS --- */
export const getPriorisationSectionId = (columnDef, colCellId) =>
  columnDef.sectionId;

export const getCellId = (cell, entityToGet, displayedTable) => {
  const colId = cell.column.id;
  const rowId = cell.row.original[entityToGet].id;
  const sectionId =
    displayedTable === 'associations'
      ? cell.column.id
      : cell.column.columnDef.sectionId;
  return [colId, rowId, sectionId];
};

/* --- CONSTANTS --- */
/* Associations colors */
export const ASSOCIATION_COLORS = [
  rgb('#deebf7'),
  rgb('#c6dbef'),
  rgb('#9ecae1'),
  rgb('#6baed6'),
  rgb('#4292c6'),
  rgb('#2171b5'),
  rgb('#08519c'),
];

/* PRIORITIZATION */
export const PRIORITISATION_COLORS = [
  rgb('#d53e4f'),
  rgb('#f46d43'),
  rgb('#fdae61'),
  rgb('#fee08b'),
  rgb('#e6f598'),
  rgb('#abdda4'),
  rgb('#66c2a5'),
];

/* ASSOCIATION SCALE */
export const asscScaleDomain = scaleQuantize().domain([0, 1]);
export const assocScale = asscScaleDomain.range(ASSOCIATION_COLORS);

/* PRIORITISATION SCALE */
export const prioritizationScaleDomain = scaleQuantize().domain([-1, 1]);
export const prioritizationScale = prioritizationScaleDomain.range(
  PRIORITISATION_COLORS
);

/* --- GLOBAL HELPERS --- */
export const getScale = isAssoc => (isAssoc ? assocScale : prioritizationScale);
