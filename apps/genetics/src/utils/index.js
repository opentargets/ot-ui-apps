import { format } from 'd3-format';

export const commaSeparate = format(',');

export function sanitize(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}

/* 
Example usage:
const comparatorDiseaseName = generateComparator(d => d.disease.name);
 */
export const generateComparator = accessor => (a, b) => {
  const aValue = accessor(a);
  const bValue = accessor(b);
  return aValue > bValue ? 1 : aValue === bValue ? 0 : -1;
};

//phenotype ids
export const getPhenotypeId = phenotypeId =>
  phenotypeId.includes('^')
    ? phenotypeId.slice(phenotypeId.lastIndexOf('^') + 1)
    : phenotypeId;

export const getSpliceId = phenotypeId =>
  phenotypeId.includes('^')
    ? phenotypeId.slice(0, phenotypeId.lastIndexOf('^'))
    : null;

// Consants
export const SIGNIFICANCE = -Math.log10(5e-8);

// chromosome helpers
export * from './chromosome';

// Pages helpers
export * from './gene';
export * from './variant';
export * from './study';
