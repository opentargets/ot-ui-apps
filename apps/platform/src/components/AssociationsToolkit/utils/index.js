import { scaleQuantize, rgb } from 'd3';
import Legend from './Legend';

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
// export const PRIORITISATION_COLORS = [
//   rgb('#a50026'),
//   rgb('#99445a'),
//   rgb('#8d898d'),
//   rgb('#81cdc1'),
//   rgb('#59a4b5'),
//   rgb('#307aa8'),
//   rgb('#08519c'),
// ];

// export const PRIORITISATION_COLORS = [
//   rgb('#f46e43'),
//   rgb('#f79e6c'),
//   rgb('#fbcf96'),
//   rgb('#feffbf'),
//   rgb('#cbebb6'),
//   rgb('#99d6ae'),
//   rgb('#66c2a5'),
// ];

// Red to green
// export const PRIORITISATION_COLORS = [
//   rgb('#b2172b'),
//   rgb('#c15e6f'),
//   rgb('#cfa4b3'),
//   rgb('#deebf7'),
//   rgb('#9dcfbf'),
//   rgb('#5cb487'),
//   rgb('#1b984f'),
// ];

// Red to blue
export const PRIORITISATION_COLORS = [
  rgb('#b2172b'),
  rgb('#c15e6f'),
  rgb('#cfa4b3'),
  rgb('#deebf7'),
  rgb('#97b8d9'),
  rgb('#4f84ba'),
  rgb('#08519c'),
];

// Red, yellow, green
// export const PRIORITISATION_COLORS = [
//   rgb('#d53e4f'),
//   rgb('#f46d43'),
//   rgb('#fdae61'),
//   rgb('#fee08b'),
//   rgb('#e6f598'),
//   rgb('#abdda4'),
//   rgb('#66c2a5'),
// ];

// export const PRIORITISATION_COLORS = [
//   rgb('#b2172b'),
//   rgb('#bd4c5e'),
//   rgb('#c88191'),
//   rgb('#d3b6c4'),
//   rgb('#deebf7'),
//   rgb('#a9c5e0'),
//   rgb('#739eca'),
//   rgb('#3e78b3'),
//   rgb('#08519c'),
// ];

// export const PRIORITISATION_COLORS = [
//   rgb('#65001c'),
//   rgb('#932d40'),
//   rgb('#be5761'),
//   rgb('#e3858d'),
//   rgb('#fdb8bd'),
//   rgb('#adccfe'),
//   rgb('#7aa2e5'),
//   rgb('#4c79c8'),
//   rgb('#25539e'),
//   rgb('#002f73'),
// ];

/* ASSOCIATION SCALE */
export const asscScaleDomain = scaleQuantize().domain([0, 1]);
export const assocScale = asscScaleDomain.range(ASSOCIATION_COLORS);

/* PRIORITISATION SCALE */
export const prioritizationScaleDomain = scaleQuantize().domain([-1, 1]);
export const prioritizationScale = prioritizationScaleDomain.range(
  PRIORITISATION_COLORS
);

/* LEGENDS */
const PrioritisationLegend = Legend(prioritizationScale, {
  title: 'Prioritisation indicator',
  tickFormat: (d, i) => ['Negative', ' ', ' ', ' ', ' ', 'Positive'][i],
});

const AssociationsLegend = Legend(assocScale, {
  title: 'Association score',
  tickFormat: '.1f',
});

export const getLegend = isAssoc => {
  if (isAssoc) return AssociationsLegend;
  return PrioritisationLegend;
};

/* --- GLOBAL HELPERS --- */
export const getScale = isAssoc => (isAssoc ? assocScale : prioritizationScale);
