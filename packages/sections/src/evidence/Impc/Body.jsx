import { Typography } from "@mui/material";
import { useState, useEffect } from "react";

import {
  Link,
  SectionItem,
  Tooltip,
  Table,
  TableDrawer,
  MouseModelAllelicComposition,
  useCursorBatchDownloader,
  getComparator,
  getPage,
  DirectionOfEffectIcon,
  DirectionOfEffectTooltip,
} from "ui";

import client from "../../client";
import { definition } from ".";
import Description from "./Description";
import INTOGEN_QUERY from "./sectionQuery.gql";
import { dataTypesMap } from "../../dataTypes";
import { sentenceCase } from "../../utils/global";
import { defaultRowsPerPageOptions, naLabel } from "../../constants";

const columns = [
  {
    id: "disease",
    label: "Disease/phenotype",
    renderCell: ({ disease, diseaseFromSource }) => (
      <Tooltip
        title={
          <>
            <Typography variant="subtitle2" display="block" align="center">
              Reported disease or phenotype:
            </Typography>
            <Typography variant="caption" display="block" align="center">
              {sentenceCase(diseaseFromSource)}
            </Typography>
          </>
        }
        showHelpIcon
      >
        <Link to={`/disease/${disease.id}`}>{disease.name}</Link>
      </Tooltip>
    ),
    filterValue: ({ disease, diseaseFromSource }) => [disease.name, diseaseFromSource].join(),
  },
  {
    id: "diseaseModelAssociatedHumanPhenotypes",
    label: "Human phenotypes",
    renderCell: ({ diseaseModelAssociatedHumanPhenotypes: humanPhenotypes }) => {
      const entries = humanPhenotypes
        ? humanPhenotypes.map(entry => ({
            name: entry.label,
            group: "Human phenotypes",
          }))
        : [];
      return (
        <TableDrawer
          entries={entries}
          showSingle={false}
          message={`${humanPhenotypes ? humanPhenotypes.length : 0} phenotype${
            humanPhenotypes === null || humanPhenotypes.length !== 1 ? "s" : ""
          }`}
        />
      );
    },
    filterValue: ({ diseaseModelAssociatedHumanPhenotypes = [] }) =>
      diseaseModelAssociatedHumanPhenotypes?.map(dmahp => dmahp.label).join(),
  },
  {
    id: "diseaseModelAssociatedModelPhenotypes",
    label: "Mouse phenotypes",

    renderCell: ({ diseaseModelAssociatedModelPhenotypes: mousePhenotypes }) => (
      <TableDrawer
        entries={mousePhenotypes.map(entry => ({
          name: entry.label,
          group: "Mouse phenotypes",
        }))}
        showSingle={false}
        message={`${mousePhenotypes.length} phenotype${mousePhenotypes.length !== 1 ? "s" : ""}`}
      />
    ),
    filterValue: ({ diseaseModelAssociatedModelPhenotypes = [] }) =>
      diseaseModelAssociatedModelPhenotypes.map(dmamp => dmamp.label).join(),
  },
  {
    id: "directionOfVariantEffect",
    label: (
      <DirectionOfEffectTooltip docsUrl="https://platform-docs.opentargets.org/evidence#impc"></DirectionOfEffectTooltip>
    ),
    renderCell: ({ variantEffect, directionOnTrait }) => {
      return (
        <DirectionOfEffectIcon variantEffect={variantEffect} directionOnTrait={directionOnTrait} />
      );
    },
  },
  {
    id: "literature",
    label: "Mouse model allelic composition",
    renderCell: ({
      biologicalModelAllelicComposition,
      biologicalModelGeneticBackground,
      biologicalModelId,
    }) => {
      if (
        biologicalModelAllelicComposition &&
        biologicalModelGeneticBackground &&
        biologicalModelId
      ) {
        return (
          <Link external to={`https://identifiers.org/${biologicalModelId}`}>
            <MouseModelAllelicComposition
              allelicComposition={biologicalModelAllelicComposition}
              geneticBackground={biologicalModelGeneticBackground}
            />
          </Link>
        );
      }
      if (biologicalModelAllelicComposition && biologicalModelGeneticBackground) {
        return (
          <MouseModelAllelicComposition
            allelicComposition={biologicalModelAllelicComposition}
            geneticBackground={biologicalModelGeneticBackground}
          />
        );
      }

      return naLabel;
    },
  },
];

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
    label: "diseaseModelAssociatedHumanPhenotypes",
    exportValue: row => row.diseaseModelAssociatedHumanPhenotypes,
  },
  {
    label: "diseaseModelAssociatedModelPhenotypes",
    exportValue: row => row.diseaseModelAssociatedModelPhenotypes,
  },
  {
    label: "literature",
    exportValue: row => row.biologicalModelId,
  },
];

function fetchData({ ensemblId, efoId, cursor, size }) {
  return client.query({
    query: INTOGEN_QUERY,
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

  useEffect(() => {
    let isCurrent = true;

    fetchData({ ensemblId, efoId, cursor: "", size }).then(res => {
      const { cursor: newCursor, rows: newRows, count: newCount } = res.data.disease.impc;
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
    INTOGEN_QUERY,
    {
      ensemblId,
      efoId,
    },
    `data.disease.impc`
  );

  const handlePageChange = newPage => {
    const newPageInt = Number(newPage);
    if (size * newPageInt + size > rows.length && cursor !== null) {
      setLoading(true);
      fetchData({ ensemblId, efoId, cursor, size }).then(res => {
        const { cursor: newCursor, rows: newRows } = res.data.disease.impc;
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
        const { cursor: newCursor, rows: newRows } = res.data.disease.impc;
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
      chipText={dataTypesMap.animal_model}
      request={{
        loading: initialLoading,
        data: { [entity]: { impc: { rows, count: rows.length } } },
      }}
      entity={entity}
      renderDescription={() => <Description symbol={label.symbol} name={label.name} />}
      renderBody={() => (
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
          query={INTOGEN_QUERY.loc.source.body}
          dataDownloader
          dataDownloaderRows={getWholeDataset}
          dataDownloaderColumns={exportColumns}
          dataDownloaderFileStem="impc-evidence"
          variables={{
            ensemblId,
            efoId,
            cursor,
            size,
          }}
        />
      )}
    />
  );
}

export default Body;
