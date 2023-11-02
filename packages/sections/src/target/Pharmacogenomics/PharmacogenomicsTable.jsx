import { Link, DataTable, Tooltip, LabelChip } from "ui";

// import { identifiersOrgLink } from "../../utils/global";
import { defaultRowsPerPageOptions } from "../../constants";

function getColumns(symbol) {
  return [
    {
      id: "rsId",
      label: "RsID",
      renderCell: ({ variantRsId }) => variantRsId,
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
          {genotypeId}
        </Tooltip>
      ),
    },
    {
      // todo: check the value of label and value
      id: "variantFunctionalConsequenceId",
      label: "Variant Consequence",
      renderCell: ({ variantFunctionalConsequenceId }) => (
        <LabelChip
          label={variantFunctionalConsequenceId}
          value={variantFunctionalConsequenceId}
          tooltip={"Ensembl variant effect predictor"}
        />
      ),
    },

    {
      id: "drug",
      label: "Drug(s)",
      renderCell: ({ drugId }) => (
        <Link to={`https://platform.opentargets.org/drug/${drugId}`}>{drugId}</Link>
      ),
    },
    {
      id: "adverseOutcome",
      label: "Adverse Outcome",
      renderCell: ({ phenotypeText }) => (
        <Tooltip title={`Genotypennotationtext`}>
          <Link>{phenotypeText}</Link>
        </Tooltip>
      ),
    },
    {
      id: "adverseOutcomeCategory",
      label: "Adverse Outcome Category",
      renderCell: ({ pgxCategory }) => ({ pgxCategory }),
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
          {evidenceLevel}
        </Tooltip>
      ),
    },
    {
      id: "source",
      label: "Source",
      renderCell: ({ studyId }) => (
        <Link to={`https://www.pharmgkb.org/clinicalAnnotations/${studyId}`}> {studyId}</Link>
      ),
    },
    {
      id: "literature",
      label: "Literature",
      renderCell: ({ literature }) => <Link> {literature}</Link>,
    },
  ];
}

function OverviewTab({ symbol, pathways, query, variables }) {
  return (
    <DataTable
      showGlobalFilter
      dataDownloader
      columns={getColumns(symbol)}
      rows={pathways}
      rowsPerPageOptions={defaultRowsPerPageOptions}
      query={query}
      variables={variables}
    />
  );
}

export default OverviewTab;
