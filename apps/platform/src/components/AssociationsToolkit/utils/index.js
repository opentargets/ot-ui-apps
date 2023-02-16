import { scaleQuantize, rgb } from 'd3';
import Legend from './Legend';
import config from '../../../config';

export const isPartnerPreview = config.profile.isPartnerPreview;

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

export const cellHasValue = score => {
  return typeof score === 'number';
};

/* --- CONSTANTS --- */
const primaryColor = isPartnerPreview ? '#407253' : '#3489ca';

/* Associations colors */
const PUBLIC_ASSOCIATION_COLORS = [
  rgb('#deebf7'),
  rgb('#c6dbef'),
  rgb('#9ecae1'),
  rgb('#6baed6'),
  rgb('#4292c6'),
  rgb('#2171b5'),
  rgb('#08519c'),
];

// PPP Greens
const PPP_ASSOCIATION_COLORS = [
  rgb('#ebf0ed'),
  rgb('#cfdbd3'),
  rgb('#b2c6ba'),
  rgb('#96b1a0'),
  rgb('#799c86'),
  rgb('#5d876d'),
  rgb('#407253'),
];

export const ASSOCIATION_COLORS = isPartnerPreview
  ? PPP_ASSOCIATION_COLORS
  : PUBLIC_ASSOCIATION_COLORS;

/* PRIORITIZATION */
// Red to blue
const PUBLIC_PRIORITISATION_COLORS = [
  rgb('#b2172b'),
  rgb('#c15e6f'),
  rgb('#cfa4b3'),
  rgb('#deebf7'),
  rgb('#97b8d9'),
  rgb('#4f84ba'),
  rgb('#08519c'),
];

// PPP red to green
const PPP_PRIORITISATION_COLORS = [
  rgb('#b2172b'),
  rgb('#bc5863'),
  rgb('#c59a9b'),
  rgb('#cfdbd3'),
  rgb('#9fb8a8'),
  rgb('#70957e'),
  rgb('#407253'),
];

export const PRIORITISATION_COLORS = isPartnerPreview
  ? PPP_PRIORITISATION_COLORS
  : PUBLIC_PRIORITISATION_COLORS;

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

/* --- CSS VARIABLES --- */
export const tableCSSVariables = {
  '--grey-light': '#ececec',
  '--grey-mid': '#b8b8b8',
  '--primary-color': primaryColor,
  '--header-border-color': 'var(--grey-light)',
  '--aggregations-color': 'var(--grey-mid)',
  '--entities-border-color': 'var(--grey-light)',
  '--table-footer-border-color': 'var(--grey-light)',
  '--row-hover-color': 'var(--grey-light)',
};
