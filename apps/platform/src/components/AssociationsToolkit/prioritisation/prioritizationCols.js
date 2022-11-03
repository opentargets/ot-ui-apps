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
    label: 'Target in clinic',
    category: 'Precedence',
    sectionId: '',
    description: 'Target is in clinical trials for any indication',
  },
  {
    id: 'isProteinCoding',
    label: 'Protein coding',
    category: 'Tractability',
    sectionId: '',
    description: 'Target is a protein coding gene',
  },
  {
    id: 'isInMembrane',
    label: 'Membrane protein',
    category: 'Tractability',
    sectionId: '',
    description: 'Target is annotated to be located in the cell membrane',
  },
  {
    id: 'isSecreted',
    label: 'Secreted',
    category: 'Tractability',
    sectionId: '',
    description: 'Target is annotated to be secreted',
  },
  {
    id: 'hasLigand',
    label: 'Ligand binder',
    category: 'Tractability',
    sectionId: '',
    description: 'Target binds a specific ligand',
  },
  {
    id: 'hasPocket',
    label: 'Predicted pockets',
    category: 'Tractability',
    sectionId: '',
    description: 'Target has predicted pockets',
  },
  {
    id: 'hasMouseKO',
    label: 'Mouse KO',
    category: 'Doability',
    sectionId: '',
    description: 'Availability of mouse knockout models for the target',
  },
  {
    id: 'hasHighQualityChemicalProbes',
    label: 'Chemical probes',
    category: 'Doability',
    sectionId: '',
    description: 'Availability of high quality chemical probes for the target',
  },
  {
    id: 'hasTEP',
    label: 'TEP',
    category: 'Doability',
    sectionId: '',
    description: 'Availability of Target Enabling Package for the target',
  },
  {
    id: 'geneticConstraint',
    label: 'Genetic constraint',
    category: 'Safety',
    sectionId: '',
    description: 'Relative genetic constraint in natural populations derived from GnomAD',
  },
  {
    id: 'hasSafetyEvent',
    label: 'Known adverse events',
    category: 'Safety',
    sectionId: '',
    description: 'Target associated with a curated adverse event',
  },
  {
    id: 'isCancerDriverGene',
    label: 'Cancer driver gene',
    category: 'Safety',
    sectionId: '',
    description: 'Target is classified as an Oncogene and/or Tumor Suppressor Gene',
  },
  {
    id: 'mouseOrthologIdentityPercentage',
    label: 'Mouse ortholog identity',
    category: 'Safety',
    sectionId: '',
    description: 'Mouse ortholog identity percentage',
  },
  {
    id: 'hasParalogs',
    label: 'Paralogues',
    category: 'Safety',
    sectionId: '',
    description: 'Target has human paralogues',
  },
];

export default cols;
