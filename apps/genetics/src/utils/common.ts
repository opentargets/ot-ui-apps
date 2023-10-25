import { format } from 'd3-format';

/* 
Example usage:
const comparatorDiseaseName = generateComparator(d => d.disease.name);
 */
export const generateComparator =
  <T, U>(accessor: (d: T) => U) =>
  (a: T, b: T) => {
    const aValue = accessor(a);
    const bValue = accessor(b);
    return aValue > bValue ? 1 : aValue === bValue ? 0 : -1;
  };

export const getData = (
  data?: { [k: string]: any },
  property?: string
): object | boolean => {
  if (!data || Object.keys(data).length === 0) return false;
  if (!property) return data;
  if (hasData(data, property)) return data[property];
  return false;
};

export const hasData = (data: { [k: string]: any }, property: string) => {
  if (data && data[property]) return true;
  return false;
};

type D3FormatNumberLike = number | { valueOf(): number };
export const commaSeparate: (n: D3FormatNumberLike) => string = format(',');
export const safeCommaSeparate = (n?: D3FormatNumberLike | null) =>
  n ? commaSeparate(n) : '';

export const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9]/g, '');

interface TraitAuthorYearStudyInfo {
  traitReported: string;
  pubAuthor: string;
  pubDate: string;
}
export const traitAuthorYear = (s: TraitAuthorYearStudyInfo) =>
  `${s.traitReported} (${s.pubAuthor}, ${new Date(s.pubDate).getFullYear()})`;

export const isGreaterThanZero = (arrayLength: number) => {
  return arrayLength > 0;
};

export const getPhenotypeId = (phenotypeId: string) =>
  phenotypeId.includes('^')
    ? phenotypeId.slice(phenotypeId.lastIndexOf('^') + 1)
    : phenotypeId;

export const getSpliceId = (phenotypeId: string) =>
  phenotypeId.includes('^')
    ? phenotypeId.slice(0, phenotypeId.lastIndexOf('^'))
    : null;

// Constants
export const SIGNIFICANCE = -Math.log10(5e-8);
