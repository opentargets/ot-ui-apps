import { scaleQuantize, rgb } from 'd3';
import Legend from './Legend';
import dataSources from '../static_datasets/dataSourcesAssoc';
import config from '../../../config';

export const { isPartnerPreview } = config.profile;

export const ENTITIES = {
  TARGET: 'target',
  EVIDENCE: 'evidence',
  DISEASE: 'disease',
  DRUG: 'drug',
};

export const groupViewColumnsBy = (input, key) =>
  input.reduce((acc, currentValue) => {
    const groupKey = currentValue[key];
    const { isPrivate } = currentValue;
    if (isPrivate === false || typeof isPrivate === 'undefined') {
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

export const getCellId = (
  cell,
  entityToGet,
  displayedTable,
  tablePrefix = null
) => {
  const colId = cell.column.id;
  const rowId = cell.row.original[entityToGet].id;
  const sectionId =
    displayedTable === 'associations'
      ? cell.column.id
      : cell.column.columnDef.sectionId;
  return [rowId, colId, sectionId, tablePrefix];
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

export const getControlChecked = (values, id) =>
  values.filter(val => val.id === id).length > 0;

/* --- CONSTANTS --- */
const { primaryColor } = config.profile;

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
// Red to blue
export const PRIORITISATION_COLORS = [
  rgb('#ec2746'),
  rgb('#f16d47'),
  rgb('#f19d5c'),
  rgb('#f0c584'),
  rgb('#c8b95f'),
  rgb('#95ae43'),
  rgb('#52a237'),
];

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
  '--text-color': '#5A5F5F',
  '--aggregations-background-color': 'var(--grey-light)',
  '--aggregations-border-color': 'var(--grey-mid)',
  '--header-border-color': 'var(--grey-light)',
  // '--aggregations-color': 'var(--grey-mid)',
  '--entities-border-color': 'var(--grey-light)',
  '--table-header-min-width': '120px',
  '--table-header-max-width': '160px',
  '--table-left-column-width': '260px',
  '--table-footer-border-color': 'var(--grey-light)',
  '--row-hover-color': 'var(--grey-light)',
  '--colums-controls-color': 'var(--grey-lighter)',
};
