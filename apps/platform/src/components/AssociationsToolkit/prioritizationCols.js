// // ### TRACTABILITY
// 'isProteinCoding'	Protein = 1/ other = 0
// 'isInMembrane'	Yes=1, No= 0
// 'isSecreted'	Yes=1, No= 0
// 'hasPocket'	Yes = 1, No = 0
// 'hasLigand'	Yes = 1, No = 0

// // ### SAFETY
// 'hasSafetyEvent' Yes = -1 , No =0
// 'geneticConstraint'	Continuous [-1,1]
// 'hasParalogs'	[has paralogs = 1 / No = 0]
// 'mouseOrthologIdentityPercentage'	Continuous (0,1)
// 'isCancerDriverGene'	Yes = -1 / no =0

// // ### DOABILITY
// 'hasTEP'	Yes=1, No=0
// 'hasMouseKO'	Yes=1, No=0
// 'hasHighQualityChemicalProbes'	Yes =1, No =0

// // ### PRECEDENCE
// 'inClinicalTrials'

const cols = [
  { id: 'isProteinCoding', label: 'isProteinCoding', category: 'tractability' },
  { id: 'isInMembrane', label: 'isInMembrane', category: 'tractability' },
  { id: 'isSecreted', label: 'isSecreted', category: 'tractability' },
  { id: 'hasPocket', label: 'hasPocket', category: 'tractability' },
  { id: 'hasLigand', label: 'hasLigand', category: 'tractability' },
  { id: 'hasSafetyEvent', label: 'hasSafetyEvent', category: 'safety' },
  { id: 'geneticConstraint', label: 'geneticConstraint', category: 'safety' },
  { id: 'hasParalogs', label: 'hasParalogs', category: 'safety' },
  {
    id: 'mouseOrthologIdentityPercentage',
    label: 'mouseOrthologIdentityPercentage',
    category: 'safety',
  },
  { id: 'isCancerDriverGene', label: 'isCancerDriverGene', category: 'safety' },
  { id: 'hasTEP', label: 'hasTEP', category: 'doability' },
  { id: 'hasMouseKO', label: 'hasMouseKO', category: 'doability' },
  {
    id: 'hasHighQualityChemicalProbes',
    label: 'hasHighQualityChemicalProbes',
    category: 'doability',
  },
  { id: 'inClinicalTrials', label: 'inClinicalTrials', category: 'precedence' },
];

export default cols;
