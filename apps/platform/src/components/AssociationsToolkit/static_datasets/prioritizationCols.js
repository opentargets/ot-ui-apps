const cols = [
  {
    id: 'maxClinicalTrialPhase',
    label: 'Target in clinic',
    aggregation: 'Precedence',
    sectionId: 'knownDrugs',
    description: 'Target is in clinical trials for any indication',
    docsLink: 'http://home.opentargets.org/aotf-documentation#target-in-clinic',
  },
  {
    id: 'isInMembrane',
    label: 'Membrane protein',
    aggregation: 'Tractability',
    sectionId: 'subcellularLocation',
    description: 'Target is annotated to be located in the cell membrane',
    docsLink: 'http://home.opentargets.org/aotf-documentation#membrane-protein',
  },
  {
    id: 'isSecreted',
    label: 'Secreted protein',
    aggregation: 'Tractability',
    sectionId: 'subcellularLocation',
    description: 'Target is annotated to be secreted',
    docsLink: 'http://home.opentargets.org/aotf-documentation#secreted-protein',
  },
  {
    id: 'hasLigand',
    label: 'Ligand binder',
    aggregation: 'Tractability',
    sectionId: 'tractability',
    description: 'Target binds a specific ligand',
    docsLink: 'http://home.opentargets.org/aotf-documentation#ligand-binder',
  },
  {
    id: 'hasPocket',
    label: 'Predicted pockets',
    aggregation: 'Tractability',
    sectionId: 'tractability',
    description: 'Target has predicted pockets',
    docsLink:
      'http://home.opentargets.org/aotf-documentation#predicted-pockets',
  },
  {
    id: 'hasMouseKO',
    label: 'Mouse KO',
    aggregation: 'Doability',
    sectionId: 'mousePhenotypes',
    description: 'Availability of mouse knockout models for the target',
    docsLink: 'http://home.opentargets.org/aotf-documentation#mouse-ko',
  },
  {
    id: 'mouseOrthologMaxIdentityPercentage',
    label: 'Mouse ortholog identity',
    aggregation: 'Doability',
    sectionId: 'compGenomics',
    description: 'Mouse ortholog maximum identity percentage',
    docsLink:
      'http://home.opentargets.org/aotf-documentation#mouse-ortholog-identity',
  },
  {
    id: 'hasHighQualityChemicalProbes',
    label: 'Chemical probes',
    aggregation: 'Doability',
    sectionId: 'chemicalProbes',
    description: 'Availability of high quality chemical probes for the target',
    docsLink: 'http://home.opentargets.org/aotf-documentation#chemical-probes',
  },
  // {
  //   id: 'hasTEP',
  //   label: 'TEP',
  //   aggregation: 'Doability',
  //   sectionId: 'tractability',
  //   description: 'Availability of Target Enabling Package for the target',
  //   docsLink: 'https://partner-platform.opentargets.org/projects',
  // },
  {
    id: 'geneticConstraint',
    label: 'Genetic constraint',
    aggregation: 'Safety',
    sectionId: 'geneticConstraint',
    description:
      'Relative genetic constraint in natural populations derived from GnomAD',
    docsLink:
      'http://home.opentargets.org/aotf-documentation#genetic-constraint',
  },
  {
    id: 'hasSafetyEvent',
    label: 'Known adverse events',
    aggregation: 'Safety',
    sectionId: 'safety',
    description: 'Target associated with a curated adverse event',
    docsLink:
      'http://home.opentargets.org/aotf-documentation#known-adverse-events',
  },
  {
    id: 'isCancerDriverGene',
    label: 'Cancer driver gene',
    aggregation: 'Safety',
    sectionId: 'cancerHallmarks', // Safety
    description:
      'Target is classified as an Oncogene and/or Tumor Suppressor Gene',
    docsLink:
      'http://home.opentargets.org/aotf-documentation#cancer-driver-gene',
  },
  {
    id: 'paralogMaxIdentityPercentage',
    label: 'Paralogues',
    aggregation: 'Safety',
    sectionId: 'compGenomics',
    description: 'Paralog maximum identity percentage',
    docsLink: 'http://home.opentargets.org/aotf-documentation#paralogues',
  },
  {
    id: 'tissueSpecificity',
    label: 'Tissue specificity',
    aggregation: 'Safety',
    sectionId: 'expressions',
    description:
      'HPA category types of elevated expression across tissues for the target',
    docsLink:
      'http://home.opentargets.org/aotf-documentation#tissue-specificity',
  },
  {
    id: 'tissueDistribution',
    label: 'Tissue distribution',
    aggregation: 'Safety',
    sectionId: 'expressions',
    description:
      'HPA category types of detectable expression across tissues for the target',
    docsLink:
      'http://home.opentargets.org/aotf-documentation#tissue-distribution',
  },
];

export const grouped = {
  Precedence: [
    {
      id: 'maxClinicalTrialPhase',
      label: 'Target in clinic',
      category: 'Precedence',
      sectionId: 'knownDrugs',
      description: 'Target is in clinical trials for any indication',
    },
  ],
  Tractability: [
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
  ],
  Doability: [
    {
      id: 'hasMouseKO',
      label: 'Mouse KO',
      category: 'Doability',
      sectionId: 'mousePhenotypes',
      description: 'Availability of mouse knockout models for the target',
    },
    {
      id: 'mouseOrthologMaxIdentityPercentage',
      label: 'Mouse ortholog identity',
      category: 'Doability',
      sectionId: 'compGenomics',
      description: 'Mouse ortholog maximum identity percentage',
    },
    {
      id: 'hasHighQualityChemicalProbes',
      label: 'Chemical probes',
      category: 'Doability',
      sectionId: 'chemicalProbes',
      description:
        'Availability of high quality chemical probes for the target',
    },
    {
      id: 'hasTEP',
      label: 'TEP',
      category: 'Doability',
      sectionId: 'tractability',
      description: 'Availability of Target Enabling Package for the target',
    },
  ],
  Safety: [
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
      sectionId: 'cancerHallmarks',
      description:
        'Target is classified as an Oncogene and/or Tumor Suppressor Gene',
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
  ],
};

export default cols;
