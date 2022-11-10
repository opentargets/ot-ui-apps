const cols = [
  {
    id: 'maxClinicalTrialPhase',
    label: 'Target in clinic',
    category: 'Precedence',
    sectionId: 'knownDrugs',
    description: 'Target is in clinical trials for any indication',
  },
  {
    id: 'isInMembrane',
    label: 'Membrane protein',
    category: 'Tractability',
    sectionId: 'subcellularLocation',
    description: 'Target is annotated to be located in the cell membrane',
  },
  {
    id: 'isSecreted',
    label: 'Secreted protein',
    category: 'Tractability',
    sectionId: 'subcellularLocation',
    description: 'Target is annotated to be secreted',
  },
  {
    id: 'hasLigand',
    label: 'Ligand binder',
    category: 'Tractability',
    sectionId: 'tractability',
    description: 'Target binds a specific ligand',
  },
  {
    id: 'hasPocket',
    label: 'Predicted pockets',
    category: 'Tractability',
    sectionId: 'tractability',
    description: 'Target has predicted pockets',
  },
  {
    id: 'hasMouseKO',
    label: 'Mouse KO',
    category: 'Doability',
    sectionId: 'mousePhenotypes',
    description: 'Availability of mouse knockout models for the target',
  },
  {
    id: 'hasHighQualityChemicalProbes',
    label: 'Chemical probes',
    category: 'Doability',
    sectionId: 'chemicalProbes',
    description: 'Availability of high quality chemical probes for the target',
  },
  {
    id: 'hasTEP',
    label: 'TEP',
    category: 'Doability',
    sectionId: 'tractability',
    description: 'Availability of Target Enabling Package for the target',
  },
  {
    id: 'geneticConstraint',
    label: 'Genetic constraint',
    category: 'Safety',
    sectionId: 'geneticConstraint',
    description:
      'Relative genetic constraint in natural populations derived from GnomAD',
  },
  {
    id: 'hasSafetyEvent',
    label: 'Known adverse events',
    category: 'Safety',
    sectionId: 'safety',
    description: 'Target associated with a curated adverse event',
  },
  {
    id: 'isCancerDriverGene',
    label: 'Cancer driver gene',
    category: 'Safety',
    sectionId: 'cancerHallmarks', // Safety
    description:
      'Target is classified as an Oncogene and/or Tumor Suppressor Gene',
  },
  {
    id: 'mouseOrthologMaxIdentityPercentage',
    label: 'Mouse ortholog identity',
    category: 'Safety',
    sectionId: 'compGenomics',
    description: 'Mouse ortholog maximum identity percentage',
  },
  {
    id: 'paralogMaxIdentityPercentage',
    label: 'Paralogues',
    category: 'Safety',
    sectionId: 'compGenomics',
    description: 'Paralog maximum identity percentage',
  },
  {
    id: 'tissueSpecificity',
    label: 'Tissue specificity',
    category: 'Safety',
    sectionId: 'expressions',
    description:
      'HPA category types of elevated expression across tissues for the target',
  },
  {
    id: 'tissueDistribution',
    label: 'Tissue distribution',
    category: 'Safety',
    sectionId: 'expressions',
    description:
      'HPA category types of detectable expression across tissues for the target',
  },
];

export default cols;
