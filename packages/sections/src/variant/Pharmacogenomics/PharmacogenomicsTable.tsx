import { Fragment } from 'react';
import classNames from "classnames";
import { makeStyles } from "@mui/styles";
import { Link, DataTable, Tooltip, PublicationsDrawer } from "ui";

import { epmcUrl } from "../../utils/urls";
import {
  defaultRowsPerPageOptions,
  naLabel,
  PHARM_GKB_COLOR,
} from "../../constants";
// import { identifiersOrgLink, sentenceCase } from "../../utils/global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

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
  blueIcon: {
    color: theme.palette.primary.main,
  },
}));

const getLevelElementClassName = (level: string) => {
  switch (level) {
    case "1":
      return "green";
    case "1A":
      return "green";
    case "1B":
      return "green";
    case "2":
      return "blue";
    case "2A":
      return "blue";
    case "2B":
      return "blue";
    case "3":
      return "yellow";
    case "4":
      return "red";
    default:
      return "red";
  }
};

function PharamacogenomicsTable({ pharmacogenomics, query, variables }) {
  const classes = useStyles();
  const columns = [
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
      id: "drug",
      label: "Drug(s)",
      renderCell: ({ drugs }) => {
        const drugsInfo = drugs.filter(d => d.drugId || d.drugFromSource);
        if (!drugsInfo.length) return naLabel;
        return (
          <>
            {
              drugsInfo.map(({ drugId, drugFromSource }, i) => {
                const drugText = drugFromSource
                  ? drugFromSource.toUpperCase()
                  : drugId;
                return (
                  <Fragment key={drugText}>
                    {i > 0 && ", "}
                    {drugId
                      ? <Link key={drugText} to={`/drug/${drugId}`}>{drugText}</Link>
                      : <Fragment key={drugText}>{drugText}</Fragment>
                    }
                  </Fragment>
                );
              })
            }
          </>
        )
      },
      filterValue: ({ drugs }) => (
        drugs.map(d => `${d.drugFromSource ?? ""} ${d.drugId ?? ""}`).join(" ")
      ),
    },    
    {
      id: "drugResponse",
      label: "Drug Response Phenotype",
      renderCell: ({ phenotypeText = naLabel, phenotypeFromSourceId, genotypeAnnotationText }) => {
        let phenotypeTextElement = phenotypeText;
        if (phenotypeFromSourceId)
          phenotypeTextElement = (
            <Link to={`/disease/${phenotypeFromSourceId}`}>{phenotypeTextElement}</Link>
          );
        if (genotypeAnnotationText)
          phenotypeTextElement = (
            <Tooltip title={genotypeAnnotationText} showHelpIcon>
              {phenotypeTextElement}
            </Tooltip>
          );
        return phenotypeTextElement;
      },
      filterValue: ({ phenotypeText }) => phenotypeText,
    },
    {
      id: "drugResponseCategory",
      label: "Drug Response Category",
      renderCell: ({ pgxCategory }) => pgxCategory || naLabel,
      filterValue: ({ pgxCategory }) => pgxCategory,
    },
    {
      id: "isDirectTarget",
      label: "Direct Drug Target",
      renderCell: ({ isDirectTarget }) => {
        const ICON_NAME = isDirectTarget ? faCircleCheck : faCircleXmark;
        return <FontAwesomeIcon icon={ICON_NAME} size="lg" className={classes.blueIcon} />;
      },
    },
    {
      id: "confidenceLevel",
      label: "Confidence Level",
      comparator: (a, b) => (b.evidenceLevel < a.evidenceLevel ? 1 : -1),
      sortable: true,
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
      filterValue: ({ evidenceLevel }) => `Level ${evidenceLevel}`,
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
      sortBy="evidenceLevel"
      columns={columns}
      rows={pharmacogenomics}
      rowsPerPageOptions={defaultRowsPerPageOptions}
      query={query}
      variables={variables}
    />
  );
}

export default PharamacogenomicsTable;