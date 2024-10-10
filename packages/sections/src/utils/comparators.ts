/*
Example usage:
const comparatorDiseaseName = generateComparatorFromAccessor(d => d.disease.name);
 */
export const generateComparatorFromAccessor = accessor => (a, b) => {
  const aValue = accessor(a);
  const bValue = accessor(b);
  if (aValue > bValue) return 1;
  if (aValue === bValue) return 0;
  return -1;
};

/*
  Compares a breakpoint against a breakpoint helper.
 */
export const breakpointMatch = (breakpoint, breakpointHelper) => {
  const breakpointMap = { xs: 0, sm: 1, md: 2, lg: 3, xl: 4 };
  const isDownComparator = breakpointHelper.includes("Down");
  const isUpComparator = breakpointHelper.includes("Up");

  const breakpointIndex = breakpointMap[breakpoint];
  const breakpointHelperIndex = breakpointMap[breakpointHelper.replace(/Down|Up|Only/g, "")];

  if (breakpointIndex === breakpointHelperIndex) {
    return true;
  }

  if (isDownComparator && breakpointIndex <= breakpointHelperIndex) {
    return true;
  }

  if (isUpComparator && breakpointIndex >= breakpointHelperIndex) {
    return true;
  }

  return false;
};

/*
  Compares variants by chromosome, position, reference allele, alternate allele
*/
const chromosomeRank = new Map;
for (let i = 1; i <= 22; i++) {
  chromosomeRank.set(String(i), i);
}
chromosomeRank.set('X', 23);
chromosomeRank.set('Y', 24);

type VariantType = {
  variant: {
    chromosome: string;
    position: number;
    referenceAllele: string;
    alternateAllele: string;
  }
};

export function variantComparator(
      { variant: v1 }: VariantType,
      { variant: v2 }: VariantType
    ) {

  if (!v1 || !v2) return 0;

  const chromosomeDiff =
    chromosomeRank.get(v1.chromosome) - chromosomeRank.get(v2.chromosome);
  if (chromosomeDiff !== 0) return chromosomeDiff;
  
  const positionDiff = v1.position - v2.position;
  if (positionDiff !== 0) return positionDiff
 
  if (v1.referenceAllele < v2.referenceAllele) return -1;
  else if (v1.referenceAllele > v2.referenceAllele) return 1;
  else if (v1.alternateAllele < v2.alternateAllele) return -1;
  else if (v1.alternateAllele > v2.alternateAllele) return 1;
  
  return 0;
}

export function mantissaExponentComparator(m1, e1, m2, e2) {
  if (e1 === e2) return m1 - m2;
  return e1 - e2;
}