import { useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  Link,
  SectionItem,
  Tooltip,
  ChipList,
  TableDrawer,
  DirectionOfEffectIcon,
  DirectionOfEffectTooltip,
  OtTableSSP,
} from "ui";

import { phaseMap, sourceMap, naLabel, dataTypesMap } from "@ot/constants";
import Description from "./Description";
import { definition } from ".";

import CHEMBL_QUERY from "./ChemblQuery.gql";
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
    label: "targets",
    exportValue: row => row.target,
  },
  {
    label: "drug",
    exportValue: row => row.drug,
  },
  {
    label: "mechanismofAction",
    exportValue: row => row.drug.mechanismsOfAction,
  },
  {
    label: "clinicalPhase",
    exportValue: row => row.clinicalPhase,
  },
  {
    label: "clinicalStatus",
    exportValue: row => row.clinicalStatus,
  },
  {
    label: "studyStartDate",
    exportValue: row => row.studyStartDate,
  },
  {
    label: "source",
    exportValue: row => row.urls,
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
      renderCell: ({ variantEffect, directionOnTrait }) => {
        return (
          <DirectionOfEffectIcon
            variantEffect={variantEffect}
            directionOnTrait={directionOnTrait}
          />
        );
      },
    },
    {
      id: "clinicalPhase",
      label: "Phase",
      sortable: true,
      renderCell: ({ clinicalPhase }) => phaseMap(clinicalPhase),
      filterValue: ({ clinicalPhase }) => phaseMap(clinicalPhase),
    },
    {
      id: "clinicalStatus",
      label: "Status",
      renderCell: ({ studyStopReason, clinicalStatus, studyStopReasonCategories }) => {
        if (clinicalStatus && studyStopReason)
          return (
            <Tooltip
              showHelpIcon
              title={
                <div className={classes.tooltipContainer}>
                  <div>
                    <span>Study stop reason: {studyStopReason}</span>
                  </div>
                  <div className={classes.chipContainer}>
                    {studyStopReasonCategories ? (
                      <ChipList
                        items={studyStopReasonCategories.map(reason => ({
                          label: reason,
                          customClass: classes.chipStyle,
                        }))}
                      />
                    ) : null}
                  </div>
                </div>
              }
            >
              {clinicalStatus}
            </Tooltip>
          );
        if (clinicalStatus) return clinicalStatus;
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
    {
      label: "Source",
      renderCell: ({ urls }) => {
        const urlList = urls.map(({ niceName, url }) => ({
          name: sourceMap[niceName] ? sourceMap[niceName] : niceName,
          url,
          group: "sources",
        }));
        return <TableDrawer entries={urlList} caption="Sources" />;
      },
      filterValue: ({ urls }) => {
        const labels = urls.map(({ niceName }) =>
          sourceMap[niceName] ? sourceMap[niceName] : niceName
        );
        return labels.join();
      },
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
      chipText={dataTypesMap.known_drug}
      entity={entity}
      request={request}
      renderDescription={() => <Description symbol={label.symbol} name={label.name} />}
      renderBody={() => (
        <OtTableSSP
          query={CHEMBL_QUERY}
          columns={columns}
          dataDownloader
          dataDownloaderColumns={exportColumns}
          dataDownloaderFileStem="chembl-evidence"
          entity={entity}
          sectionName="chembl"
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
