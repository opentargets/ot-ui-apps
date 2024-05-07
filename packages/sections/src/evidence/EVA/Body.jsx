import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import {
  Link,
  SectionItem,
  Tooltip,
  LabelChip,
  PublicationsDrawer,
  getPage,
  Table,
  getComparator,
  useCursorBatchDownloader,
  ClinvarStars,
  DirectionOfEffectIcon,
  DirectionOfEffectTooltip,
} from "ui";

import {
  clinvarStarMap,
  naLabel,
  defaultRowsPerPageOptions,
  variantConsequenceSource,
} from "../../constants";
import { definition } from ".";

import client from "../../client";
import Description from "./Description";
import { epmcUrl } from "../../utils/urls";
import CLINVAR_QUERY from "./ClinvarQuery.gql";
import { dataTypesMap } from "../../dataTypes";
import { sentenceCase, identifiersOrgLink } from "../../utils/global";

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
    label: "variantConsequence",
    exportValue: row => row.variantFunctionalConsequence,
  },
  {
    label: "clinicalSignificances",
    exportValue: row => row.clinicalSignificances,
  },
  {
    label: "allelicRequirements",
    exportValue: row => row.alleleOrigins,
  },
  {
    label: "reviewStatus",
    exportValue: row => row.confidence,
  },
];

function getColumns(label) {
  return [
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
        // trim long IDs and append '...'
        variantId ? (
          <>
            {variantId.substring(0, 20)}
            {variantId.length > 20 ? "\u2026" : ""}
          </>
        ) : (
          naLabel
        ),
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
    },
    {
      id: "variantHgvsId",
      label: "HGVS ID",
      renderCell: ({ variantHgvsId }) => variantHgvsId || naLabel,
    },
    {
      id: "studyId",
      label: "ClinVar ID",
      renderCell: ({ studyId }) =>
        studyId ? (
          <Link external to={`https://www.ncbi.nlm.nih.gov/clinvar/${studyId}`}>
            {studyId}
          </Link>
        ) : (
          naLabel
        ),
    },
    {
      id: "variantConsequence",
      label: "Variant Consequence",
      renderCell: ({
        variantFunctionalConsequence,
        variantFunctionalConsequenceFromQtlId,
        variantId,
      }) => {
        const pvparams = variantId?.split("_") || [];
        return (
          <div style={{ display: "flex", gap: "5px" }}>
            {variantFunctionalConsequence && (
              <LabelChip
                label={variantConsequenceSource.VEP.label}
                value={sentenceCase(variantFunctionalConsequence.label)}
                tooltip={variantConsequenceSource.VEP.tooltip}
                to={identifiersOrgLink("SO", variantFunctionalConsequence.id.slice(3))}
              />
            )}
            {variantFunctionalConsequenceFromQtlId && (
              <LabelChip
                label={variantConsequenceSource.QTL.label}
                value={sentenceCase(variantFunctionalConsequenceFromQtlId.label)}
                to={identifiersOrgLink("SO", variantFunctionalConsequenceFromQtlId.id.slice(3))}
                tooltip={variantConsequenceSource.QTL.tooltip}
              />
            )}
            {(variantFunctionalConsequence.id === "SO:0001583" ||
              variantFunctionalConsequence.id === "SO:0001587") && (
              <LabelChip
                label={variantConsequenceSource.ProtVar.label}
                to={`https://www.ebi.ac.uk/ProtVar/query?chromosome=${pvparams[0]}&genomic_position=${pvparams[1]}&reference_allele=${pvparams[2]}&alternative_allele=${pvparams[3]}`}
                tooltip={variantConsequenceSource.ProtVar.tooltip}
              />
            )}
          </div>
        );
      },
      filterValue: ({ variantFunctionalConsequence, variantFunctionalConsequenceFromQtlId }) =>
        `${sentenceCase(variantFunctionalConsequence.label)}, ${sentenceCase(
          variantFunctionalConsequenceFromQtlId.label
        )}`,
    },
    {
      id: "directionOfVariantEffect",
      label: (
        <DirectionOfEffectTooltip docsUrl="https://platform-docs.opentargets.org/evidence#clinvar"></DirectionOfEffectTooltip>
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
      id: "clinicalSignificances",
      filterValue: ({ clinicalSignificances }) => clinicalSignificances.join(),
      label: "Clinical significance",
      renderCell: ({ clinicalSignificances }) => {
        if (!clinicalSignificances) return naLabel;
        if (clinicalSignificances.length === 1) return sentenceCase(clinicalSignificances[0]);
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
      id: "confidence",
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
}

function fetchClinvar({ ensemblId, efoId, cursor, size, freeTextQuery }) {
  return client.query({
    query: CLINVAR_QUERY,
    variables: {
      ensemblId,
      efoId,
      cursor,
      size,
      freeTextQuery,
    },
  });
}

function Body({ id, label, entity }) {
  const { ensgId: ensemblId, efoId } = id;
  const [initialLoading, setInitialLoading] = useState(true); // state variable to keep track of initial loading of rows
  const [loading, setLoading] = useState(false); // state variable to keep track of loading state on page chage
  const [count, setCount] = useState(0);
  const [cursor, setCursor] = useState("");
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const columns = getColumns(label);

  useEffect(() => {
    let isCurrent = true;

    fetchClinvar({ ensemblId, efoId, cursor: "", size }).then(res => {
      const { cursor: newCursor, rows: newRows, count: newCount } = res.data.disease.eva;
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
    CLINVAR_QUERY,
    {
      ensemblId,
      efoId,
    },
    `data.disease.eva`
  );

  const handlePageChange = newPage => {
    const newPageInt = Number(newPage);
    if (size * newPageInt + size > rows.length && cursor !== null) {
      setLoading(true);
      fetchClinvar({ ensemblId, efoId, cursor, size }).then(res => {
        const { cursor: newCursor, rows: newRows } = res.data.disease.eva;
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
      fetchClinvar({ ensemblId, efoId, cursor, size: newPageSizeInt }).then(res => {
        const { cursor: newCursor, rows: newRows } = res.data.disease.eva;
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
      chipText={dataTypesMap.genetic_association}
      entity={entity}
      request={{
        loading: initialLoading,
        data: { [entity]: { eva: { rows, count: rows.length } } },
      }}
      renderDescription={() => <Description symbol={label.symbol} name={label.name} />}
      renderBody={() => (
        <Table
          // showGlobalFilter
          // globalFilter={globalFilter}
          // onGlobalFilterChange={handleGlobalFilterChange}
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
          query={CLINVAR_QUERY.loc.source.body}
          dataDownloader
          dataDownloaderRows={getWholeDataset}
          dataDownloaderColumns={exportColumns}
          dataDownloaderFileStem="clinvar-evidence"
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
