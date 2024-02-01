import { isPrivateDataSource } from "./utils/partnerPreviewUtils";

const dataSources = [
  {
    id: "ot_genetics_portal", // ot_genetics_portal
    label: "Open Targets Genetics",
    isPrivate: isPrivateDataSource("ot_genetics_portal"),
  },
  { id: "eva", label: "ClinVar", isPrivate: isPrivateDataSource("eva") }, // eva
  {
    id: "gene_burden", // gene_burden
    label: "Gene Burden",
    isPrivate: isPrivateDataSource("cancer_biomarkers"),
  },
  {
    id: "genomics_england",
    label: "GEL PanelApp",
    isPrivate: isPrivateDataSource("genomics_england"),
  },
  {
    id: "gene2phenotype", // gene2phenotype
    label: "Gene2phenotype",
    isPrivate: isPrivateDataSource("gene2phenotype"),
  },
  {
    id: "uniprot_literature", // uniprot_literature
    label: "UniProt literature",
    isPrivate: isPrivateDataSource("uniprot_literature"),
  },
  {
    id: "clingen", // clingen
    label: "Clingen",
    isPrivate: isPrivateDataSource("clingen"),
  },
  {
    id: "cancer_gene_census", // cancer_gene_census
    label: "Cancer Gene Census",
    isPrivate: isPrivateDataSource("cancer_gene_census"),
  },
  {
    id: "intogen", // intogen
    label: "IntOGen",
    isPrivate: isPrivateDataSource("intogen"),
  },
  {
    id: "eva_somatic", // eva_somatic
    label: "ClinVar (somatic)",
    isPrivate: isPrivateDataSource("eva_somatic"),
  },
  { id: "chembl", label: "ChEMBL", isPrivate: isPrivateDataSource("chembl") },
  {
    id: "crispr_screen", // crispr_screen
    label: "CRISPR Screens",
    isPrivate: isPrivateDataSource("crispr_screen"),
  },
  {
    id: "crispr", // crispr
    label: "Project Score",
    isPrivate: isPrivateDataSource("crispr"),
  },
  {
    id: "slapenrich", // slapenrich
    label: "SLAPenrich",
    isPrivate: isPrivateDataSource("slapenrich"),
  },
  {
    id: "progeny", // progeny
    label: "PROGENy",
    isPrivate: isPrivateDataSource("progeny"),
  },
  {
    id: "reactome", // reactome
    label: "Reactome",
    isPrivate: isPrivateDataSource("reactome"),
  },
  {
    id: "sysbio", // sysbio
    label: "Gene signatures",
    isPrivate: isPrivateDataSource("sysbio"),
  },
  {
    id: "europepmc", // europepmc
    label: "Europe PMC",
    isPrivate: isPrivateDataSource("europepmc"),
  },
  {
    id: "expression_atlas", // expression_atlas
    label: "Expression Atlas",
    isPrivate: isPrivateDataSource("expression_atlas"),
  },
  {
    id: "impc", // impc
    label: "IMPC",
    isPrivate: isPrivateDataSource("impc"),
  },
  {
    id: "uniprot_variants", // uniprot_variants
    label: "UniProt curated variants",
    isPrivate: isPrivateDataSource("uniprot_variants"),
  },
  {
    id: "orphanet", // orphanet
    label: "Orphanet",
    isPrivate: isPrivateDataSource("orphanet"),
  },
  // Private
  {
    id: "ot_crispr", // ot_crispr
    label: "OTAR CRISPR",
    isPrivate: isPrivateDataSource("ot_crispr"),
  },
  // Private
  {
    id: "ot_crispr_validation", // ot_crispr_validation
    label: "OT CRISPR Validation",
    isPrivate: isPrivateDataSource("ot_crispr_validation"),
  },
  // Private
  {
    id: "encore",
    label: "ENCORE",
    isPrivate: isPrivateDataSource("encore"),
  },
  {
    id: "cancer_biomarkers", // cancer_biomarkers
    label: "Cancer Biomarkers",
    isPrivate: isPrivateDataSource("cancer_biomarkers"),
    dataType: "affected_pathway",
  },
];

const dataSourcesMap = dataSources.reduce((acc, dataSource) => {
  acc[dataSource.id] = dataSource.label;
  return acc;
}, {});

export { dataSourcesMap };

export default dataSources;
