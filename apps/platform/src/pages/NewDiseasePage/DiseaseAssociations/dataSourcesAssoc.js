import { isPrivateDataSource } from '../../../utils/partnerPreviewUtils';

const dataSources = [
  {
    id: 'ot_genetics_portal',
    sectionId: 'otGenetics',
    label: 'OT Genetics Portal',
    isPrivate: isPrivateDataSource('ot_genetics_portal'),
    symbol: 'sy',
    aggregation: 'genetic_association',
    weight: 1,
  },
  {
    id: 'eva',
    sectionId: 'eva',
    label: 'ClinVar',
    isPrivate: isPrivateDataSource('eva'),
    symbol: 'sy',
    aggregation: 'genetic_association',
    weight: 1,
  },
  {
    id: 'gene_burden',
    sectionId: 'geneBurden',
    label: 'Gene Burden',
    isPrivate: isPrivateDataSource('cancer_biomarkers'),
    symbol: 'sy',
    aggregation: 'genetic_association',
    weight: 1,
  },
  {
    id: 'genomics_england',
    sectionId: 'genomicsEngland',
    label: 'GEL PanelApp',
    isPrivate: isPrivateDataSource('genomics_england'),
    symbol: 'sy',
    aggregation: 'genetic_association',
    weight: 1,
  },
  {
    id: 'gene2phenotype',
    sectionId: 'gene2Phenotype',
    label: 'Gene2phenotype',
    isPrivate: isPrivateDataSource('gene2phenotype'),
    symbol: 'sy',
    aggregation: 'genetic_association',
    weight: 1,
  },
  {
    id: 'uniprot_literature',
    sectionId: 'uniprotLiterature',
    label: 'UniProt literature',
    isPrivate: isPrivateDataSource('uniprot_literature'),
    symbol: 'sy',
    aggregation: 'genetic_association',
    weight: 1,
  },
  {
    id: 'uniprot_variants',
    sectionId: 'uniprotVariants',
    label: 'UniProt curated variants',
    isPrivate: isPrivateDataSource('uniprot_variants'),
    symbol: 'sy',
    aggregation: 'genetic_association',
    weight: 1,
  },
  {
    id: 'orphanet',
    sectionId: 'orphanet',
    label: 'Orphanet',
    isPrivate: isPrivateDataSource('orphanet'),
    symbol: 'sy',
    aggregation: 'genetic_association',
    weight: 1,
  },
  {
    id: 'clingen',
    sectionId: 'clinGen',
    label: 'Clingen',
    isPrivate: isPrivateDataSource('clingen'),
    symbol: 'sy',
    aggregation: 'genetic_association',
    weight: 1,
  },
  {
    id: 'cancer_gene_census',
    sectionId: 'cancerGeneCensus',
    label: 'Cancer Gene Census',
    isPrivate: isPrivateDataSource('cancer_gene_census'),
    symbol: 'sy',
    aggregation: 'somatic_mutations',
    weight: 1,
  },
  {
    id: 'intogen',
    sectionId: 'intOgen',
    label: 'IntOGen',
    isPrivate: isPrivateDataSource('intogen'),
    symbol: 'sy',
    aggregation: 'somatic_mutations',
    weight: 1,
  },
  {
    id: 'eva_somatic',
    sectionId: 'evaSomatic',
    label: 'ClinVar (somatic)',
    isPrivate: isPrivateDataSource('eva_somatic'),
    symbol: 'sy',
    aggregation: 'somatic_mutations',
    weight: 1,
  },
  {
    id: 'cancer_biomarkers',
    sectionId: 'cancerBiomarkers',
    label: 'Cancer Biomarkers',
    isPrivate: isPrivateDataSource('cancer_biomarkers'),
    symbol: 'sy',
    aggregation: 'somatic_mutations',
    weight: 1,
  },
  {
    id: 'chembl',
    sectionId: 'chembl',
    label: 'ChEMBL',
    isPrivate: isPrivateDataSource('chembl'),
    symbol: 'sy',
    aggregation: 'known_drug',
    weight: 1,
  },
  {
    id: 'crispr',
    sectionId: 'crispr',
    label: 'Project Score',
    isPrivate: isPrivateDataSource('crispr'),
    symbol: 'sy',
    aggregation: 'affected_pathway',
    weight: 1,
  },
  {
    id: 'slapenrich',
    sectionId: 'slapEnrich',
    label: 'SLAPenrich',
    isPrivate: isPrivateDataSource('slapenrich'),
    symbol: 'sy',
    aggregation: 'affected_pathway',
    weight: 0.5,
  },
  {
    id: 'progeny',
    sectionId: 'progeny',
    label: 'PROGENy',
    isPrivate: isPrivateDataSource('progeny'),
    symbol: 'sy',
    aggregation: 'affected_pathway',
    weight: 0.5,
  },
  {
    id: 'reactome',
    sectionId: 'reactome',
    label: 'Reactome',
    isPrivate: isPrivateDataSource('reactome'),
    symbol: 'sy',
    aggregation: 'affected_pathway',
    weight: 1,
  },
  {
    id: 'sysbio',
    sectionId: 'sysBio',
    label: 'Gene signatures',
    isPrivate: isPrivateDataSource('sysbio'),
    symbol: 'sy',
    aggregation: 'affected_pathway',
    weight: 0.5,
  },
  {
    id: 'europepmc',
    sectionId: 'europePmc',
    label: 'Europe PMC',
    isPrivate: isPrivateDataSource('europepmc'),
    symbol: 'sy',
    aggregation: 'literature',
    weight: 0.2,
  },
  {
    id: 'expression_atlas',
    sectionId: 'expression',
    label: 'Expression Atlas',
    isPrivate: isPrivateDataSource('expression_atlas'),
    symbol: 'sy',
    aggregation: 'rna_expression',
    weight: 0.2,
  },
  {
    id: 'impc',
    sectionId: 'impc',
    label: 'IMPC',
    isPrivate: isPrivateDataSource('impc'),
    symbol: 'sy',
    aggregation: 'animal_model',
    weight: 0.2,
  },
  {
    id: 'ot_crispr_validation',
    sectionId: 'validationlab',
    label: 'OT CRISPR Validation',
    isPrivate: isPrivateDataSource('ot_validation_lab'),
    symbol: 'sy',
    aggregation: 'ot_validation_lab',
    weight: 0.5,
  },
  // Private
  {
    id: 'ot_crispr',
    sectionId: 'otCrispr',
    label: 'OTAR CRISPR',
    isPrivate: isPrivateDataSource('ot_crispr'),
    symbol: 'sy',
    aggregation: 'ot_validation_lab',
    weight: 0.5,
  },
  // Private
  // {
  //   id: 'encore',
  //   sectionId: '',
  //   label: 'ENCORE',
  //   isPrivate: isPrivateDataSource('encore'),
  //   symbol: 'sy',
  //   aggregation: 'ot_validation_lab',
  //   weight: 0.5,
  // },
];

export default dataSources;
