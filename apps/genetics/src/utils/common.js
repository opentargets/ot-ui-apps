import { format } from 'd3-format';

/* 
Example usage:
const comparatorDiseaseName = generateComparator(d => d.disease.name);
 */
export const generateComparator = accessor => (a, b) => {
  const aValue = accessor(a);
  const bValue = accessor(b);
  return aValue > bValue ? 1 : aValue === bValue ? 0 : -1;
};

export const getData = data => {
  if (data && data != '') {
    return data;
  } else return {};
};

export const commaSeparate = format(',');

export function sanitize(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}

// Consants
export const SIGNIFICANCE = -Math.log10(5e-8);
