import { Link, DataTable, Tooltip, LabelChip, PublicationsDrawer } from "ui";

import { epmcUrl } from "../../utils/urls";
import { defaultRowsPerPageOptions, naLabel } from "../../constants";

const columns = [
  {
    id: "rsId",
    label: "rsID",
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
              <Link
                external
                to="https://github.com/apriltuesday/opentargets-pharmgkb/tree/issue-18#variant-coordinate-computation"
              >
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
            label={variantFunctionalConsequence.id}
            value={variantFunctionalConsequence.label}
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
    renderCell: ({ phenotypeText = naLabel, phenotypeFromSourceId, genotypeAnnotationText }) => {
      const phenotypeTextElement = phenotypeFromSourceId ? (
        <Link tooltip={genotypeAnnotationText} to={`/disease/${phenotypeFromSourceId}`}>
          {phenotypeText}
        </Link>
      ) : (
        <Tooltip title={genotypeAnnotationText}>{phenotypeText}</Tooltip>
      );
      return phenotypeTextElement;
    },
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
        <Link external to={`https://www.pharmgkb.org/clinicalAnnotation/${studyId}`}>
          PharmGKB-{studyId}
        </Link>
      ) : (
        naLabel
      ),
  },
  {
    id: "literature",
    renderCell: ({ literature }) => {
      const literatureList =
        literature?.reduce((acc, id) => {
          if (id === "NA") return acc;

          return [
            ...acc,
            {
              name: id,
              url: epmcUrl(id),
              group: "literature",
            },
          ];
        }, []) || [];

      return <PublicationsDrawer entries={literatureList} />;
    },
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
