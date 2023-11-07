import { Link, DataTable, Tooltip, LabelChip } from "ui";

// import { identifiersOrgLink } from "../../utils/global";
import { defaultRowsPerPageOptions, naLabel } from "../../constants";

const columns = [
  {
    id: "rsId",
    label: "RsID",
    renderCell: ({ variantRsId }) => variantRsId || naLabel,
  },
  {
    id: "genotypeId",
    label: "Genotype ID",
    renderCell: ({ genotypeId }) =>
      genotypeId ? (
        <Tooltip
          title={
            <>
              VCF-style(chr_pos_ref_allele1,allele2). See
              <Link external to="google.com">
                {" "}
                here{" "}
              </Link>
              for more details
            </>
          }
        >
          <span>{genotypeId}</span>
        </Tooltip>
      ) : (
        naLabel
      ),
  },
  {
    id: "variantFunctionalConsequence",
    label: "Variant Consequence",
    renderCell: ({ variantFunctionalConsequence }) => {
      if (variantFunctionalConsequence)
        return (
          <LabelChip
            label={variantFunctionalConsequence.id || naLabel}
            value={variantFunctionalConsequence.label || naLabel}
            tooltip="Ensembl variant effect predictor"
          />
        );
      return naLabel;
    },
  },
  {
    id: "drug",
    label: "Drug(s)",
    renderCell: ({ drug }) =>
      drug && drug?.id ? <Link to={`/drug/${drug.id}`}>{drug.name || drug.id}</Link> : naLabel,
  },
  {
    id: "drugResponse",
    label: "Drug Response",
    renderCell: ({ phenotypeText, phenotypeFromSourceId, genotypeAnnotationText }) => (
      <Tooltip title={genotypeAnnotationText}>
        <span>
          <Link to={`/disease/${phenotypeFromSourceId}`}>{phenotypeText}</Link>
        </span>
      </Tooltip>
    ),
  },
  {
    id: "drugResponseCategory",
    label: "Drug Response Category",
    renderCell: ({ pgxCategory }) => pgxCategory || naLabel,
  },
  {
    id: "confidenceLevel",
    label: "Confidence (Level)",
    renderCell: ({ evidenceLevel }) =>
      evidenceLevel ? (
        <Tooltip
          title={
            <span>
              As defined by
              <Link external to={`https://www.pharmgkb.org/page/clinAnnLevels`}>
                {" "}
                PharmGKB ClinAnn Levels
              </Link>
            </span>
          }
        >
          <span>{evidenceLevel}</span>
        </Tooltip>
      ) : (
        naLabel
      ),
  },
  {
    id: "source",
    label: "Source",
    renderCell: ({ studyId }) =>
      studyId ? (
        <Link to={`https://www.pharmgkb.org/clinicalAnnotations/${studyId}`}>{studyId}</Link>
      ) : (
        naLabel
      ),
  },
  {
    id: "literature",
    label: "Literature",
    renderCell: ({ literature }) =>
      literature.length > 0 ? (
        <span>
          {literature.map(e => (
            <Link key={e}> {e}</Link>
          ))}
        </span>
      ) : (
        naLabel
      ),
  },
];

function OverviewTab({ pharmacogenomics, query, variables }) {
  return (
    <DataTable
      showGlobalFilter
      dataDownloader
      columns={columns}
      rows={pharmacogenomics}
      rowsPerPageOptions={defaultRowsPerPageOptions}
      query={query}
      variables={variables}
    />
  );
}

export default OverviewTab;
