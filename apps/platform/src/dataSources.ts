import { isPrivateDataSource } from "./utils/partnerPreviewUtils";

// Define interface for data source
interface DataSource {
  id: string;
  label: string;
  isPrivate: boolean;
  dataType?: string;
}

const dataSources: DataSource[] = [
  {
    id: "ot_genetics_portal",
    label: "Open Targets Genetics",
    isPrivate: isPrivateDataSource("ot_genetics_portal"),
  },
  { 
    id: "eva", 
    label: "ClinVar", 
    isPrivate: isPrivateDataSource("eva") 
  },
  {
    id: "gene_burden",
    label: "Gene Burden",
    isPrivate: isPrivateDataSource("cancer_biomarkers"),
  },
  {
    id: "genomics_england",
    label: "GEL PanelApp",
    isPrivate: isPrivateDataSource("genomics_england"),
  },
  {
    id: "gene2phenotype",
    label: "Gene2phenotype",
    isPrivate: isPrivateDataSource("gene2phenotype"),
  },
  {
    id: "uniprot_literature",
    label: "UniProt literature",
    isPrivate: isPrivateDataSource("uniprot_literature"),
  },
  {
    id: "clingen",
    label: "Clingen",
    isPrivate: isPrivateDataSource("clingen"),
  },
  {
    id: "cancer_gene_census",
    label: "Cancer Gene Census",
    isPrivate: isPrivateDataSource("cancer_gene_census"),
  },
  {
    id: "intogen",
    label: "IntOGen",
    isPrivate: isPrivateDataSource("intogen"),
  },
  {
    id: "eva_somatic",
    label: "ClinVar (somatic)",
    isPrivate: isPrivateDataSource("eva_somatic"),
  },
  { 
    id: "chembl", 
    label: "ChEMBL", 
    isPrivate: isPrivateDataSource("chembl") 
  },
  {
    id: "crispr_screen",
    label: "CRISPR Screens",
    isPrivate: isPrivateDataSource("crispr_screen"),
  },
  {
    id: "crispr",
    label: "Project Score",
    isPrivate: isPrivateDataSource("crispr"),
  },
  {
    id: "slapenrich",
    label: "SLAPenrich",
    isPrivate: isPrivateDataSource("slapenrich"),
  },
  {
    id: "progeny",
    label: "PROGENy",
    isPrivate: isPrivateDataSource("progeny"),
  },
  {
    id: "reactome",
    label: "Reactome",
    isPrivate: isPrivateDataSource("reactome"),
  },
  {
    id: "sysbio",
    label: "Gene signatures",
    isPrivate: isPrivateDataSource("sysbio"),
  },
  {
    id: "europepmc",
    label: "Europe PMC",
    isPrivate: isPrivateDataSource("europepmc"),
  },
  {
    id: "expression_atlas",
    label: "Expression Atlas",
    isPrivate: isPrivateDataSource("expression_atlas"),
  },
  {
    id: "impc",
    label: "IMPC",
    isPrivate: isPrivateDataSource("impc"),
  },
  {
    id: "uniprot_variants",
    label: "UniProt curated variants",
    isPrivate: isPrivateDataSource("uniprot_variants"),
  },
  {
    id: "orphanet",
    label: "Orphanet",
    isPrivate: isPrivateDataSource("orphanet"),
  },
  {
    id: "ot_crispr",
    label: "OTAR CRISPR",
    isPrivate: isPrivateDataSource("ot_crispr"),
  },
  {
    id: "ot_crispr_validation",
    label: "OT CRISPR Validation",
    isPrivate: isPrivateDataSource("ot_crispr_validation"),
  },
  {
    id: "encore",
    label: "ENCORE",
    isPrivate: isPrivateDataSource("encore"),
  },
  {
    id: "cancer_biomarkers",
    label: "Cancer Biomarkers",
    isPrivate: isPrivateDataSource("cancer_biomarkers"),
    dataType: "affected_pathway",
  },
];

// Create a map of data source IDs to their labels with proper typing
const dataSourcesMap: { [key: string]: string } = dataSources.reduce((acc, dataSource) => {
  acc[dataSource.id] = dataSource.label;
  return acc;
}, {} as { [key: string]: string });

export { dataSourcesMap };
export default dataSources;