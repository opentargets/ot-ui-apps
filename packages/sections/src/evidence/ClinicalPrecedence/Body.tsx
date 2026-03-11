import { useState } from "react";
// import { makeStyles } from "@mui/styles";
import {
  Link,
  SectionItem,
  Tooltip,
  DirectionOfEffectIcon,
  DirectionOfEffectTooltip,
  OtTableSSP,
  ClinicalRecordDrawer,
} from "ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { clinicalStageCategories, naLabel, dataTypesMap } from "@ot/constants";
import Description from "./Description";
import { definition } from ".";
import CLINICAL_PRECEDENCE_QUERY from "./ClinicalPrecedence.gql";
import { Box, Typography } from "@mui/material";

// const useStyles = makeStyles(() => ({
//   tooltipContainer: {
//     padding: "0.3em",
//   },
//   chipContainer: {
//     display: "inline-block",
//     marginTop: "0.4em",
//   },
//   chipStyle: {
//     fontSize: "0.625rem",
//   },
// }));

const exportColumns = [
  {
    label: "clinicalReportId",
    exportValue: row => row.clinicalReportId,
  },
  {
    label: "diseaseId",
    exportValue: row => row.disease.id,
  },
  {
    label: "diseaseName",
    exportValue: row => row.disease.name,
  },
  {
    label: "targetId",
    exportValue: row => row.target.id,
  },
  {
    label: "targetApprovedSymbol",
    exportValue: row => row.target.approvedSymbol,
  },
  {
    label: "drugId",
    exportValue: row => row.drug.id,
  },
  {
    label: "drugName",
    exportValue: row => row.drug.name,
  },
  {
    label: "clinicalStage",
    exportValue: row => row.clinicalStage,
  },
  {
    label: "studyStartDate",
    exportValue: row => row.studyStartDate,
  },
];

const columns = [
  {
    id: "clinicalReportId",
    label: "Report",
    sticky: true,
    enableHiding: false,
    renderCell: ({ clinicalReportId, trialLiterature }) => {
      if (!clinicalReportId) return naLabel;
      return (
        <ClinicalRecordDrawer
          recordId={clinicalReportId}
        >
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
            Details
            <FontAwesomeIcon size="sm" icon={faArrowRightToBracket} />
          </Box>
        </ClinicalRecordDrawer>
      );
    },
  },
  {
    id: "disease.name",
    label: "Disease/phenotype",
    enableHiding: false,
    renderCell: ({ disease, cohortPhenotypes }) => {
      let displayElement = naLabel;
      if (disease)
        displayElement = (
          <Link asyncTooltip to={`/disease/${disease.id}`}>
            {disease.name}
          </Link>
        );
      if (cohortPhenotypes && cohortPhenotypes.length) {
        displayElement = (
          <Tooltip
            showHelpIcon
            title={
              <Box>
                <Typography variant="subtitle2" display="block" align="center">
                  All reported phenotypes:
                </Typography>
                {cohortPhenotypes.map(e => (
                  <div key={e}>{e}</div>
                ))}
              </Box>
            }
          >
            {displayElement}
          </Tooltip>
        );
      }
      return displayElement;
    },
  },
  {
    label: "Targets",
    enableHiding: false,
    renderCell: ({ target, drug, targetFromSourceId }) => {
      const mechanismsOfAction = drug.mechanismsOfAction || {};
      const { rows = [] } = mechanismsOfAction;

      let symbol = "";

      const otherTargets = rows.reduce((acc, { targets }) => {
        targets.forEach(({ id, approvedSymbol }) => {
          if (id !== target.id) {
            acc.add(id);
          } else {
            symbol = approvedSymbol;
          }
        });
        return acc;
      }, new Set());

      if (symbol === "") {
        const { approvedSymbol: targetSymbol } = target;
        symbol = targetSymbol;
      }

      return (
        <>
          <Tooltip
            title={
              <>
                Reported target:{" "}
                <Link external to={`https://identifiers.org/uniprot/${targetFromSourceId}`}>
                  {targetFromSourceId}
                </Link>
              </>
            }
            showHelpIcon
          >
            <Link asyncTooltip to={`/target/${target.id}`}>{symbol}</Link>
          </Tooltip>
          {otherTargets.size > 0
            ? ` and ${otherTargets.size} other target${otherTargets.size > 1 ? "s" : ""}`
            : null}
        </>
      );
    },
  },
  {
    id: "drug.name",
    label: "Drug",
    enableHiding: false,
    renderCell: ({ drug }) => <Link asyncTooltip to={`/drug/${drug.id}`}>{drug.name}</Link>,
  },
  {
    id: "directionOfVariantEffect",
    label: (
      <DirectionOfEffectTooltip docsUrl="https://platform-docs.opentargets.org/evidence#chembl"></DirectionOfEffectTooltip>
    ),
    renderCell: ({ directionOnTarget, directionOnTrait }) => {
      return (
        <DirectionOfEffectIcon
          variantEffect={directionOnTarget}
          directionOnTrait={directionOnTrait}
        />
      );
    },
  },
  {
    id: "clinicalStage",
    label: "Stage",
    sortable: true,
    comparator: (a, b) => {
      return clinicalStageCategories[b.clinicalStage?.index ?? -1] -
        clinicalStageCategories[a.clinicalStage?.index ?? -1];
    },
    // renderCell: ({ clinicalStage }) => clinicalStage,
    renderCell: ({ clinicalStage }) => clinicalStageCategories[clinicalStage]?.label ?? naLabel,
    filterValue: ({ clinicalStage }) => clinicalStageCategories[clinicalStage],
  },
  {
    id: "studyStartDate",
    label: "Start Date",
    numeric: true,
    comparator: (a, b) => {
      return (new Date(a.studyStartDate).getTime() || -1) -
        (new Date(b.studyStartDate).getTime() || -1);
    },
    sortable: true,
    renderCell: ({ studyStartDate }) => {
      return new Date(studyStartDate).getFullYear() || naLabel;
    },
    filterValue: ({ studyStartDate }) => {
      return new Date(studyStartDate).getFullYear() || "";
    },
  },
];

function Body({ id, label, entity }) {
  const { ensgId: ensemblId, efoId } = id;
  const [request, setRequest] = useState({ loading: true, data: null, error: false });

  // const classes = useStyles();
  // const columns = getColumns(classes);

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.clinical}
      entity={entity}
      request={request}
      renderDescription={() => <Description symbol={label.symbol} name={label.name} />}
      renderBody={() => (
        <OtTableSSP
          query={CLINICAL_PRECEDENCE_QUERY}
          columns={columns}
          sortBy="clinicalStage"
          dataDownloader
          dataDownloaderColumns={exportColumns}
          dataDownloaderFileStem={`clinical-precedence-evidence-${id}`}
          entity={entity}
          sectionName="clinical_precedence"
          showGlobalFilter={true}
          fixed={true}
          setInitialRequestData={req => {
            setRequest(req);
          }}
          variables={{
            ensemblId,
            efoId,
          }}
        />
      )}
    />
  );
}

export default Body;