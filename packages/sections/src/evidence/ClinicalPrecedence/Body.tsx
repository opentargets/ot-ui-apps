import { useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  Link,
  SectionItem,
  Tooltip,
  ChipList,
  DirectionOfEffectIcon,
  DirectionOfEffectTooltip,
  OtTableSSP,
} from "ui";

import { phaseMap, stopReasonMap, naLabel, dataTypesMap } from "@ot/constants";
import Description from "./Description";
import { definition } from ".";

import CLINICAL_PRECEDENCE_QUERY from "./ClinicalPrecedence.gql";
import { Box, Typography } from "@mui/material";

const useStyles = makeStyles(() => ({
  tooltipContainer: {
    padding: "0.3em",
  },
  chipContainer: {
    display: "inline-block",
    marginTop: "0.4em",
  },
  chipStyle: {
    fontSize: "0.625rem",
  },
}));

const exportColumns = [
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
    label: "drugType",
    exportValue: row => row.drug.drugType,
  },
  {
    label: "mechanismsOfAction",
    exportValue: ({ target, drug }) => {
      const mechanismsOfAction = drug.mechanismsOfAction || {};
      const { rows = [] } = mechanismsOfAction;

      let anchorMa = null;

      const mas = rows.reduce((acc, { mechanismOfAction, targets }) => {
        if (anchorMa === null) {
          let isAssociated = false;
          for (let i = 0; i < targets.length; i++) {
            if (targets[i].id === target.id) {
              anchorMa = mechanismOfAction;
              isAssociated = true;
              break;
            }
          }

          if (!isAssociated) {
            acc.add(mechanismOfAction);
          }
        } else {
          acc.add(mechanismOfAction);
        }

        return acc;
      }, new Set());

      return `${anchorMa || naLabel}${mas.size > 0 ? ` and ${mas.size} other MoA` : ""}`;
    },
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

function getColumns(classes) {
  return [
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
              <Link to={`/target/${target.id}`}>{symbol}</Link>
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
      renderCell: ({ drug }) => <Link to={`/drug/${drug.id}`}>{drug.name}</Link>,
    },
    {
      id: "drug.drugType",
      label: "Modality",
    },
    {
      label: "Mechanism of action (MoA)",
      renderCell: ({ target, drug }) => {
        const mechanismsOfAction = drug.mechanismsOfAction || {};
        const { rows = [] } = mechanismsOfAction;

        let anchorMa = null;

        const mas = rows.reduce((acc, { mechanismOfAction, targets }) => {
          if (anchorMa === null) {
            let isAssociated = false;
            for (let i = 0; i < targets.length; i++) {
              if (targets[i].id === target.id) {
                anchorMa = mechanismOfAction;
                isAssociated = true;
                break;
              }
            }

            if (!isAssociated) {
              acc.add(mechanismOfAction);
            }
          } else {
            acc.add(mechanismOfAction);
          }

          return acc;
        }, new Set());

        return `${anchorMa || naLabel}${mas.size > 0 ? ` and ${mas.size} other MoA` : ""}`;
      },
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
      renderCell: ({ clinicalStage }) => phaseMap(clinicalStage),
      filterValue: ({ clinicalStage }) => phaseMap(clinicalStage),
    },
    {
      id: "trialWhyStopped",
      label: "Why Stopped",
      renderCell: ({ trialWhyStopped, trialStopReasonCategories }) => {
        if (trialWhyStopped)
          return (
            <Tooltip
              showHelpIcon
              title={
                <div className={classes.tooltipContainer}>
                  <div>
                    <span>Trial stop reason: {trialWhyStopped}</span>
                  </div>
                  <div className={classes.chipContainer}>
                    {trialStopReasonCategories ? (
                      <ChipList
                        items={trialStopReasonCategories.map(reason => ({
                          label: stopReasonMap(reason),
                          customClass: classes.chipStyle,
                        }))}
                      />
                    ) : null}
                  </div>
                </div>
              }
            >
              {trialWhyStopped}
            </Tooltip>
          );
        return naLabel;
      },
    },
    {
      id: "studyStartDate",
      label: "Start Date",
      numeric: true,
      renderCell: ({ studyStartDate }) =>
        studyStartDate ? new Date(studyStartDate).getFullYear() : naLabel,
    },
  ];
}

function Body({ id, label, entity }) {
  const { ensgId: ensemblId, efoId } = id;
  const [request, setRequest] = useState({ loading: true, data: null, error: false });

  const classes = useStyles();
  const columns = getColumns(classes);

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
          showGlobalFilter={false}
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