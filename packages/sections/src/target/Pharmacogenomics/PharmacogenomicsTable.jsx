import { Link, DataTable, Tooltip, LabelChip } from "ui";

// import { identifiersOrgLink } from "../../utils/global";
import { defaultRowsPerPageOptions, naLabel } from "../../constants";

function getColumns() {
  return [
    {
      id: "rsId",
      label: "RsID",
      renderCell: ({ variantRsId }) => variantRsId || naLabel,
    },
    {
      id: "genotypeId",
      label: "Genotype ID",
      renderCell: ({ genotypeId }) => (
        <Tooltip
          title={`VCF-style(chr_pos_ref_allele1,allele2). See ${(
            <Link external to="google.com">
              here
            </Link>
          )} for more details`}
        >
          <>{genotypeId || naLabel}</>
        </Tooltip>
      ),
    },
    {
      // todo: check the value of label and value
      id: "variantFunctionalConsequenceId",
      label: "Variant Consequence",
      renderCell: ({ variantFunctionalConsequenceId }) => (
        <LabelChip
          label={variantFunctionalConsequenceId || naLabel}
          value={variantFunctionalConsequenceId || naLabel}
          tooltip={"Ensembl variant effect predictor"}
        />
      ),
    },

    {
      id: "drug",
      label: "Drug(s)",
      renderCell: ({ drugId }) => <Link to={`/drug/${drugId}`}>{drugId || naLabel}</Link>,
    },
    {
      id: "adverseOutcome",
      label: "Adverse Outcome",
      renderCell: ({ phenotypeText }) => (
        <Tooltip title={`Genotypennotationtext`}>
          <>
            <Link to={`/disease/`}>{phenotypeText || naLabel}</Link>
          </>
        </Tooltip>
      ),
    },
    {
      id: "adverseOutcomeCategory",
      label: "Adverse Outcome Category",
      renderCell: ({ pgxCategory }) => pgxCategory || naLabel,
    },
    {
      id: "confidenceLevel",
      label: "Confidence (Level)",
      renderCell: ({ evidenceLevel }) => (
        <Tooltip
          title={`As defined by ${(
            <Link to={`https://www.pharmgkb.org/page/clinAnnLevels`}> PharmGKB ClinAnn Levels</Link>
          )}`}
        >
          <>{evidenceLevel || naLabel}</>
        </Tooltip>
      ),
    },
    {
      id: "source",
      label: "Source",
      renderCell: ({ studyId }) => (
        <Link to={`https://www.pharmgkb.org/clinicalAnnotations/${studyId}`}>
          {" "}
          {studyId || naLabel}
        </Link>
      ),
    },
    {
      id: "literature",
      label: "Literature",
      renderCell: ({ literature }) => <Link> {literature.join(",")}</Link>,
    },
  ];
}

function OverviewTab({ pharmacogenomics, query, variables }) {
  return (
    <DataTable
      showGlobalFilter
      dataDownloader
      columns={getColumns()}
      rows={pharmacogenomics}
      rowsPerPageOptions={defaultRowsPerPageOptions}
      query={query}
      variables={variables}
    />
  );
}

export default OverviewTab;
