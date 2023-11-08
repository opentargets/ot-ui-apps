import classNames from "classnames";
import { makeStyles } from "@mui/styles";
import { Link, DataTable, Tooltip, LabelChip, PublicationsDrawer } from "ui";

import { epmcUrl } from "../../utils/urls";
import { defaultRowsPerPageOptions, naLabel, PHARM_GKB_COLOR } from "../../constants";

const useStyles = makeStyles(theme => ({
  level: {
    color: "white",
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
  },
  green: {
    background: PHARM_GKB_COLOR.green,
  },
  red: {
    background: PHARM_GKB_COLOR.red,
  },
  yellow: {
    background: PHARM_GKB_COLOR.yellow,
  },
  blue: {
    background: theme.palette.primary.main,
  },
}));

const getLevelElementClassName = level => {
  switch (level) {
    case "1":
      return "green";
    case "1A":
      return "green";
    case "2":
      return "level-blue";
    case "2A":
      return "level-blue";
    case "3":
      return "level-yellow";
    case "4":
      return "level-red";
    default:
      return "level-red";
  }
};

function OverviewTab({ pharmacogenomics, query, variables }) {
  const classes = useStyles();
  const columns = [
    {
      id: "rsId",
      label: "rsID",
      renderCell: ({ variantRsId }) => variantRsId || naLabel,
    },
    {
      id: "genotypeId",
      label: "Genotype ID",
      tooltip: (
        <>
          VCF-style(chr_pos_ref_allele1,allele2). See{" "}
          <Link
            external
            to="https://github.com/apriltuesday/opentargets-pharmgkb/tree/issue-18#variant-coordinate-computation"
          >
            here
          </Link>{" "}
          for more details.
        </>
      ),
      renderCell: ({ genotypeId }) => genotypeId || naLabel,
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
      renderCell: ({ drugId, drugFromSource }) =>
        drugId ? <Link to={`/drug/${drugId}`}>{drugFromSource || naLabel}</Link> : naLabel,
    },
    {
      id: "drugResponse",
      label: "Drug Response",
      renderCell: ({ phenotypeText = naLabel, phenotypeFromSourceId, genotypeAnnotationText }) => {
        const phenotypeTextElement = phenotypeFromSourceId ? (
          <Tooltip showHelpIcon title={genotypeAnnotationText}>
            <Link to={`/disease/${phenotypeFromSourceId}`}>{phenotypeText}</Link>
          </Tooltip>
        ) : (
          <Tooltip showHelpIcon title={genotypeAnnotationText}>
            {phenotypeText}
          </Tooltip>
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
      label: "Confidence Level",
      tooltip: (
        <>
          As defined by
          <Link external to={`https://www.pharmgkb.org/page/clinAnnLevels`}>
            {" "}
            PharmGKB ClinAnn Levels
          </Link>
        </>
      ),
      renderCell: ({ evidenceLevel }) => {
        if (evidenceLevel) {
          const levelClass = getLevelElementClassName(evidenceLevel);
          return (
            <span className={classNames(classes.level, classes[levelClass])}>
              Level {evidenceLevel}
            </span>
          );
        }
        return naLabel;
      },
    },
    {
      id: "source",
      label: "Source",
      renderCell: ({ studyId }) =>
        studyId ? (
          <Link external to={`https://www.pharmgkb.org/clinicalAnnotation/${studyId}`}>
            PharmGKB
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
