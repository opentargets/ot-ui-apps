// 'isProteinCoding'	Protein = 1/ other = 0
// 'isInMembrane'	Yes=1, No= 0
// // ### TRACTABILITY
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
  {
    id: 'inClinicalTrials',
    label: 'inClinicalTrials',
    category: 'precedence',
    sectionId: '',
    description: '',
  },
  {
    id: 'isProteinCoding',
    label: 'isProteinCoding',
    category: 'tractability',
    sectionId: '',
    description: '',
  },
  {
    id: 'isInMembrane',
    label: 'isInMembrane',
    category: 'tractability',
    sectionId: '',
    description: '',
  },
  {
    id: 'isSecreted',
    label: 'isSecreted',
    category: 'tractability',
    sectionId: '',
    description: '',
  },
  {
    id: 'hasPocket',
    label: 'hasPocket',
    category: 'tractability',
    sectionId: '',
    description: '',
  },
  {
    id: 'hasLigand',
    label: 'hasLigand',
    category: 'tractability',
    sectionId: '',
    description: '',
  },
  {
    id: 'hasMouseKO',
    label: 'hasMouseKO',
    category: 'doability',
    sectionId: '',
    description: '',
  },
  {
    id: 'hasHighQualityChemicalProbes',
    label: 'hasHighQualityChemicalProbes',
    category: 'doability',
    sectionId: '',
    description: '',
  },
  {
    id: 'hasTEP',
    label: 'hasTEP',
    category: 'doability',
    sectionId: '',
    description: '',
  },
  {
    id: 'geneticConstraint',
    label: 'geneticConstraint',
    category: 'safety',
    sectionId: '',
    description: '',
  },
  {
    id: 'hasSafetyEvent',
    label: 'hasSafetyEvent',
    category: 'safety',
    sectionId: '',
    description: '',
  },
  {
    id: 'isCancerDriverGene',
    label: 'isCancerDriverGene',
    category: 'safety',
    sectionId: '',
    description: '',
  },
  {
    id: 'mouseOrthologIdentityPercentage',
    label: 'mouseOrthologIdentityPercentage',
    category: 'safety',
    sectionId: '',
    description: '',
  },
  {
    id: 'hasParalogs',
    label: 'hasParalogs',
    category: 'safety',
    sectionId: '',
    description: '',
  },
];

export default cols;
