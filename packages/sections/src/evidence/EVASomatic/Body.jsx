import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  SectionItem,
  ChipList,
  Tooltip,
  Link,
  PublicationsDrawer,
  ClinvarStars,
  Table,
  useCursorBatchDownloader,
  getComparator,
  getPage,
  DirectionOfEffectIcon,
  DirectionOfEffectTooltip,
} from "ui";
import client from "../../client";

import { sentenceCase } from "../../utils/global";

import { epmcUrl } from "../../utils/urls";
import { clinvarStarMap, naLabel, defaultRowsPerPageOptions } from "../../constants";
import Description from "./Description";
import { dataTypesMap } from "../../dataTypes";
import EVA_SOMATIC_QUERY from "./EvaSomaticQuery.gql";
import { definition } from ".";

const getColumns = label => [
  {
    id: "disease.name",
    label: "Disease/phenotype",
    renderCell: ({ disease, diseaseFromSource, cohortPhenotypes }) => (
      <Tooltip
        title={
          <>
            <Typography variant="subtitle2" display="block" align="center">
              Reported disease or phenotype:
            </Typography>
            <Typography variant="caption" display="block" align="center" gutterBottom>
              {diseaseFromSource}
            </Typography>

            {cohortPhenotypes?.length > 1 ? (
              <>
                <Typography variant="subtitle2" display="block" align="center">
                  All reported phenotypes:
                </Typography>
                <Typography variant="caption" display="block">
                  {cohortPhenotypes.map(cp => (
                    <div key={cp}>{cp}</div>
                  ))}
                </Typography>
              </>
            ) : (
              ""
            )}
          </>
        }
        showHelpIcon
      >
        <Link to={`/disease/${disease.id}`}>{disease.name}</Link>
      </Tooltip>
    ),
  },
  {
    id: "variantId",
    label: "Variant ID",
    renderCell: ({ variantId }) =>
      variantId ? (
        <>
          {variantId.substring(0, 20)}
          {variantId.length > 20 ? "\u2026" : ""}
        </>
      ) : (
        naLabel
      ),
    filterValue: ({ variantId }) => `${variantId}`,
  },
  {
    id: "variantRsId",
    label: "rsID",
    renderCell: ({ variantRsId }) =>
      variantRsId ? (
        <Link
          external
          to={`http://www.ensembl.org/Homo_sapiens/Variation/Explore?v=${variantRsId}`}
        >
          {variantRsId}
        </Link>
      ) : (
        naLabel
      ),
    filterValue: ({ variantRsId }) => `${variantRsId}`,
  },
  {
    id: "variantHgvsId",
    label: "HGVS ID",
    renderCell: ({ variantHgvsId }) => variantHgvsId || naLabel,
    filterValue: ({ variantHgvsId }) => `${variantHgvsId}`,
  },
  {
    id: "studyId",
    label: "ClinVar ID",
    renderCell: ({ studyId }) => (
      <Link external to={`https://identifiers.org/clinvar.record/${studyId}`}>
        {studyId}
      </Link>
    ),
  },
  {
    id: "clinicalSignificances",
    label: "Clinical significance",
    renderCell: ({ clinicalSignificances }) => {
      if (!clinicalSignificances) return naLabel;

      if (clinicalSignificances.length === 1) return sentenceCase(clinicalSignificances[0]);

      if (clinicalSignificances.length > 1)
        return (
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
            }}
          >
            {clinicalSignificances.map(clinicalSignificance => (
              <li key={clinicalSignificance}>{sentenceCase(clinicalSignificance)}</li>
            ))}
          </ul>
        );

      return naLabel;
    },
    filterValue: ({ clinicalSignificances }) => clinicalSignificances.join(),
  },
  {
    id: "directionOfVariantEffect",
    label: (
      <DirectionOfEffectTooltip docsUrl="https://platform-docs.opentargets.org/evidence#clinvar-somatic"></DirectionOfEffectTooltip>
    ),
    renderCell: ({ variantEffect, directionOnTrait }) => {
      return (
        <DirectionOfEffectIcon variantEffect={variantEffect} directionOnTrait={directionOnTrait} />
      );
    },
  },
  {
    id: "allelicRequirements",
    label: "Allele origin",
    renderCell: ({ alleleOrigins, allelicRequirements }) => {
      if (!alleleOrigins || alleleOrigins.length === 0) return naLabel;

      if (allelicRequirements)
        return (
          <Tooltip
            title={
              <>
                <Typography variant="subtitle2" display="block" align="center">
                  Allelic requirements:
                </Typography>
                {allelicRequirements.map(r => (
                  <Typography variant="caption" key={r}>
                    {r}
                  </Typography>
                ))}
              </>
            }
            showHelpIcon
          >
            {alleleOrigins.map(a => sentenceCase(a)).join("; ")}
          </Tooltip>
        );

      return alleleOrigins.map(a => sentenceCase(a)).join("; ");
    },
    filterValue: ({ alleleOrigins }) => (alleleOrigins ? alleleOrigins.join() : ""),
  },
  {
    label: "Review status",
    renderCell: ({ confidence }) => (
      <Tooltip title={confidence}>
        <span>
          <ClinvarStars num={clinvarStarMap[confidence]} />
        </span>
      </Tooltip>
    ),
  },
  {
    label: "Literature",
    renderCell: ({ literature }) => {
      const literatureList =
        literature?.reduce((acc, id) => {
          if (id !== "NA") {
            acc.push({
              name: id,
              url: epmcUrl(id),
              group: "literature",
            });
          }
          return acc;
        }, []) || [];

      return (
        <PublicationsDrawer entries={literatureList} symbol={label.symbol} name={label.name} />
      );
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
    label: "variantId",
    exportValue: row => row.variantId,
  },
  {
    label: "variantRsId",
    exportValue: row => row.variantRsId,
  },
  {
    label: "variantHgvsId",
    exportValue: row => row.variantHgvsId,
  },
  {
    label: "clinicalSignificances",
    exportValue: row => row.clinicalSignificances,
  },
  {
    label: "allelicRequirements",
    exportValue: row => row.allelicRequirements,
  },
  {
    label: "reviewStatus",
    exportValue: row => row.confidence,
  },

  {
    label: "literature",
    exportValue: row => row.literature,
  },
];

function fetchData({ ensemblId, efoId, cursor, size }) {
  return client.query({
    query: EVA_SOMATIC_QUERY,
    fetchPolicy: "no-cache",
    variables: {
      ensemblId,
      efoId,
      cursor,
      size,
    },
  });
}

const useStyles = makeStyles({
  roleInCancerBox: {
    display: "flex",
    alignItems: "center",
    marginBottom: "2rem",
  },
  roleInCancerTitle: { marginRight: ".5rem !important" },
});

function Body({ id, label, entity }) {
  const classes = useStyles();

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
  const [target, setTarget] = useState({});

  const columns = getColumns(label);

  useEffect(() => {
    let isCurrent = true;

    fetchData({ ensemblId, efoId, cursor: "", size }).then(res => {
      const { cursor: newCursor, rows: newRows, count: newCount } = res.data.disease.eva_somatic;
      if (isCurrent) {
        setInitialLoading(false);
        setCursor(newCursor);
        setCount(newCount);
        setRows(newRows);
        setTarget(res.data.target);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  const getWholeDataset = useCursorBatchDownloader(
    EVA_SOMATIC_QUERY,
    {
      ensemblId,
      efoId,
    },
    `data.disease.eva_somatic`
  );

  const handlePageChange = newPage => {
    const newPageInt = Number(newPage);
    if (size * newPageInt + size > rows.length && cursor !== null) {
      setLoading(true);
      fetchData({ ensemblId, efoId, cursor, size }).then(res => {
        const { cursor: newCursor, rows: newRows } = res.data.disease.eva_somatic;
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
        const { cursor: newCursor, rows: newRows } = res.data.disease.eva_somatic;
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
      chipText={dataTypesMap.somatic_mutation}
      request={{
        loading: initialLoading,
        data: { [entity]: { eva_somatic: { rows, count: rows.length } } },
      }}
      entity={entity}
      renderDescription={() => <Description symbol={label.symbol} name={label.name} />}
      renderBody={() => {
        const { hallmarks } = target;
        const roleInCancerItems =
          hallmarks && hallmarks.attributes.length > 0
            ? hallmarks.attributes
                .filter(attribute => attribute.name === "role in cancer")
                .map(attribute => ({
                  label: attribute.description,
                  url: epmcUrl(attribute.pmid),
                }))
            : [{ label: "Unknown" }];
        return (
          <>
            <Box className={classes.roleInCancerBox}>
              <Typography className={classes.roleInCancerTitle}>
                <b>{label.symbol}</b> role in cancer:
              </Typography>
              <ChipList items={roleInCancerItems} />
            </Box>
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
              query={EVA_SOMATIC_QUERY.loc.source.body}
              dataDownloader
              dataDownloaderColumns={exportColumns}
              dataDownloaderRows={getWholeDataset}
              dataDownloaderFileStem="impc-evidence"
              variables={{
                ensemblId,
                efoId,
                cursor,
                size,
              }}
            />
          </>
        );
      }}
    />
  );
}

export default Body;
