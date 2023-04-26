import { scaleQuantize, rgb } from 'd3';
import Legend from './Legend';
import dataSources from '../static_datasets/dataSourcesAssoc';
import config from '../../../config';

export const {isPartnerPreview} = config.profile;

/* --- TABLE SHARED HELPERS --- */
export const getPriorisationSectionId = columnDef => columnDef.sectionId;

export const getCellId = (cell, entityToGet, displayedTable) => {
  const colId = cell.column.id;
  const rowId = cell.row.original[entityToGet].id;
  const sectionId =
    displayedTable === 'associations'
      ? cell.column.id
      : cell.column.columnDef.sectionId;
  return [colId, rowId, sectionId];
};

export const cellHasValue = score => typeof score === 'number';

export const defaulDatasourcesWeigths = dataSources.map(({ id, weight }) => ({
  id,
  weight,
  propagate: true,
}));

export const getWightSourceDefault = source => {
  const sourcesDetails = defaulDatasourcesWeigths.find(
    src => src.id === source
  );
  return sourcesDetails.weight;
};

export const checkBoxPayload = (id, aggregationId) => ({
  id,
  path: [aggregationId, id],
  name: 'dataTypes',
});

export const getControlChecked = (values = [], id) => values.filter(val => val.id == id).length > 0;

/* --- CONSTANTS --- */
const {primaryColor} = config.profile;

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
  rgb('#deebf7'),
  rgb('#c6dbef'),
  rgb('#9ecae1'),
  rgb('#6baed6'),
  rgb('#4292c6'),
  rgb('#2171b5'),
  rgb('#08519c'),
];
const _PPP_ASSOCIATION_COLORS = [
  rgb('#deebf7'),
  rgb('#c6dbef'),
  rgb('#9ecae1'),
  rgb('#6baed6'),
  rgb('#4292c6'),
  rgb('#2171b5'),
  rgb('#08519c'),
];

export const ASSOCIATION_COLORS = isPartnerPreview
  ? PPP_ASSOCIATION_COLORS
  : PUBLIC_ASSOCIATION_COLORS;

/* PRIORITIZATION */
// Red to blue
const _PUBLIC_PRIORITISATION_COLORS = [
  rgb('#b2172b'),
  rgb('#c15e6f'),
  rgb('#cfa4b3'),
  rgb('#deebf7'),
  rgb('#97b8d9'),
  rgb('#4f84ba'),
  rgb('#08519c'),
];
const PUBLIC_PRIORITISATION_COLORS = [
  rgb('#ec2746'),
  rgb('#f16d47'),
  rgb('#f19d5c'),
  rgb('#f0c584'),
  rgb('#c8b95f'),
  rgb('#95ae43'),
  rgb('#52a237'),
];

// PPP red to green
const _PPP_PRIORITISATION_COLORS = [
  rgb('#b2172b'),
  rgb('#bc5863'),
  rgb('#c59a9b'),
  rgb('#cfdbd3'),
  rgb('#9fb8a8'),
  rgb('#70957e'),
  rgb('#407253'),
];

const PPP_PRIORITISATION_COLORS = [
  rgb('#ec2746'),
  rgb('#f16d47'),
  rgb('#f19d5c'),
  rgb('#f0c584'),
  rgb('#c8b95f'),
  rgb('#95ae43'),
  rgb('#52a237'),
];
// const PPP_PRIORITISATION_COLORS = [
//   rgb('#e27c7c'),
//   rgb('#a86464'),
//   rgb('#6d4b4b'),
//   rgb('#503f3f'),
//   rgb('#333333'),
//   rgb('#3c4e4b'),
//   rgb('#466964'),
//   rgb('#599e94'),
//   rgb('#6cd4c5'),
// ];
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
  tickFormat: (d, i) => ['Deprioritised', ' ', ' ', ' ', ' ', 'Prioritised'][i],
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
  '--grey-lighter': '#f6f6f6',
  '--grey-light': '#ececec',
  '--grey-mid': '#b8b8b8',
  '--primary-color': primaryColor,
  '--header-border-color': 'var(--grey-light)',
  '--aggregations-color': 'var(--grey-mid)',
  '--entities-border-color': 'var(--grey-light)',
  '--table-footer-border-color': 'var(--grey-light)',
  '--row-hover-color': 'var(--grey-light)',
  '--colums-controls-color': 'var(--grey-lighter)',
};
