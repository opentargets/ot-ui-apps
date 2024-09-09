import { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import {
  Link,
  SectionItem,
  Tooltip,
  ChipList,
  TableDrawer,
  Table,
  useCursorBatchDownloader,
  getComparator,
  getPage,
  DirectionOfEffectIcon,
  DirectionOfEffectTooltip,
} from "ui";
import { defaultRowsPerPageOptions, phaseMap, sourceMap, naLabel } from "../../constants";
import { dataTypesMap } from "../../dataTypes";
import Description from "./Description";
import { definition } from ".";
import client from "../../client";

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
      renderCell: ({ disease, cohortPhenotypes }) => {
        let displayElement = naLabel;
        if (disease) displayElement = <Link to={`/disease/${disease.id}`}>{disease.name}</Link>;
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

function fetchData({ ensemblId, efoId, cursor, size }) {
  return client.query({
    query: CHEMBL_QUERY,
    fetchPolicy: "no-cache",
    variables: {
      ensemblId,
      efoId,
      cursor,
      size,
    },
  });
}

function Body({ id, label, entity }) {
  const { ensgId: ensemblId, efoId } = id;
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [cursor, setCursor] = useState("");
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const classes = useStyles();
  const columns = getColumns(classes);

  useEffect(() => {
    let isCurrent = true;

    fetchData({ ensemblId, efoId, cursor: "", size }).then(res => {
      const { cursor: newCursor, rows: newRows, count: newCount } = res.data.disease.chembl;
      if (isCurrent) {
        setInitialLoading(false);
        setCursor(newCursor);
        setCount(newCount);
        setRows(newRows);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  const getWholeDataset = useCursorBatchDownloader(
    CHEMBL_QUERY,
    {
      ensemblId,
      efoId,
    },
    `data.disease.chembl`
  );

  const handlePageChange = newPage => {
    const newPageInt = Number(newPage);
    if (size * newPageInt + size > rows.length && cursor !== null) {
      setLoading(true);
      fetchData({ ensemblId, efoId, cursor, size }).then(res => {
        const { cursor: newCursor, rows: newRows } = res.data.disease.chembl;
        setRows([...rows, ...newRows]);
        setLoading(false);
        setCursor(newCursor);
        setPage(newPageInt);
      });
    } else {
      setPage(newPageInt);
    }
  };

  const handleRowsPerPageChange = newPageSize => {
    const newPageSizeInt = Number(newPageSize);
    if (newPageSizeInt > rows.length && cursor !== null) {
      setLoading(true);
      fetchData({ ensemblId, efoId, cursor, size: newPageSizeInt }).then(res => {
        const { cursor: newCursor, rows: newRows } = res.data.disease.chembl;
        setRows([...rows, ...newRows]);
        setLoading(false);
        setCursor(newCursor);
        setPage(0);
        setPageSize(newPageSizeInt);
      });
    } else {
      setPage(0);
      setPageSize(newPageSizeInt);
    }
  };

  const handleSortBy = sortBy => {
    setSortColumn(sortBy);
    setSortOrder(
      // eslint-disable-next-line
      sortColumn === sortBy ? (sortOrder === "asc" ? "desc" : "asc") : "asc"
    );
  };

  const processedRows = [...rows];

  if (sortColumn) {
    processedRows.sort(getComparator(columns, sortOrder, sortColumn));
  }

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.known_drug}
      entity={entity}
      request={{
        loading: initialLoading,
        data: { [entity]: { chembl: { rows, count: rows.length } } },
      }}
      renderDescription={() => <Description symbol={label.symbol} name={label.name} />}
      renderBody={() => {
        return (
          <Table
            loading={loading}
            columns={columns}
            rows={getPage(processedRows, page, size)}
            rowCount={count}
            rowsPerPageOptions={defaultRowsPerPageOptions}
            page={page}
            pageSize={size}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onSortBy={handleSortBy}
            query={CHEMBL_QUERY.loc.source.body}
            dataDownloader
            dataDownloaderColumns={exportColumns}
            dataDownloaderRows={getWholeDataset}
            dataDownloaderFileStem="chembl-evidence"
            variables={{
              ensemblId,
              efoId,
              size,
            }}
          />
        );
      }}
    />
  );
}

export default Body;
