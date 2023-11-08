import classNames from "classnames";
import { useQuery } from "@apollo/client";
import { makeStyles } from "@mui/styles";
import { Link, SectionItem, Tooltip, DataTable, LabelChip, PublicationsDrawer } from "ui";

import { epmcUrl } from "../../utils/urls";
import { definition } from ".";
import Description from "./Description";
import PHARMACOGENOMICS_QUERY from "./Pharmacogenomics.gql";
import { naLabel, defaultRowsPerPageOptions, PHARM_GKB_COLOR } from "../../constants";

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
    background: PHARM_GKB_COLOR.blue,
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

function Body({ id: chemblId, label: name, entity }) {
  const variables = { chemblId };
  const classes = useStyles();

  const columns = [
    {
      id: "gene",
      label: "Gene",
      renderCell: ({ target, isDirectTarget }) => {
        if (target) {
          const tooltipText = isDirectTarget
            ? "The variant is in the drug's primary target gene."
            : "The variant is outside the drug's primary target gene.";
          return (
            <Tooltip title={tooltipText} showHelpIcon>
              <Link to={`/target/${target.id}`}>
                <span>{target.approvedSymbol}</span>
              </Link>
            </Tooltip>
          );
        }
        return naLabel;
      },
    },
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
      id: "drugResponse",
      label: "Drug Response",
      renderCell: ({ phenotypeText = naLabel, phenotypeFromSourceId, genotypeAnnotationText }) => {
        const phenotypeTextElement = phenotypeFromSourceId ? (
          <Tooltip title={genotypeAnnotationText} showHelpIcon>
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
      label: "Literature",
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

  const request = useQuery(PHARMACOGENOMICS_QUERY, {
    variables,
  });

  return (
    <SectionItem
      definition={definition}
      request={request}
      entity={entity}
      renderDescription={() => <Description name={name} />}
      renderBody={({ drug }) => (
        <DataTable
          showGlobalFilter
          dataDownloader
          columns={columns}
          rows={drug.pharmacogenomics}
          rowsPerPageOptions={defaultRowsPerPageOptions}
          query={PHARMACOGENOMICS_QUERY.loc.source.body}
          variables={variables}
        />
      )}
    />
  );
}

export default Body;
