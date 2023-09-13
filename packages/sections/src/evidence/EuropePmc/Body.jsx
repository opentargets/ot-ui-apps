import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { SectionItem, Link, getPage, Table } from "ui";

import Description from "./Description";
import { europePmcLiteratureQuery } from "../../utils/urls";
import { dataTypesMap } from "../../dataTypes";
import { naLabel } from "../../constants";
import Publication from "./Publication";
import EUROPE_PMC_QUERY from "./sectionQuery.gql";
import { definition } from ".";

const getColumns = (label) => [
  {
    id: "disease",
    label: "Disease/phenotype",
    renderCell: ({ disease }) => (
      <Link to={`/disease/${disease.id}`}>{disease.name}</Link>
    ),
    filterValue: ({ disease }) => disease.name,
  },
  {
    id: "publicationDetails",
    propertyPath: "title",
    label: "Publication",
    width: "80%",
    renderCell: ({
      europePmcId,
      title,
      abstract,
      textMiningSentences,
      authors,
      journal,
      source,
      patentDetails,
      isOpenAccess,
      pmcId,
      fullTextOpen,
    }) => (
      <Publication
        europePmcId={europePmcId}
        title={title}
        abstract={abstract}
        textMiningSentences={textMiningSentences}
        authors={authors}
        journal={journal}
        source={source}
        patentDetails={patentDetails}
        isOpenAccess={isOpenAccess}
        fullTextOpen={fullTextOpen}
        pmcId={pmcId}
        symbol={label.symbol}
        name={label.name}
      />
    ),
  },
  {
    id: "year",
    renderCell: ({ year }) => year || naLabel,
  },
  {
    id: "resourceScore",
    label: "Score",
    numeric: true,
  },
];

// Merges data from platform-API and EuropePMC API.
function mergeData(rows, literatureData) {
  const mergedRows = rows.map((row) => {
    const relevantEntry = literatureData.find(
      (entry) => entry.id === row.literature[0]
    );

    if (relevantEntry) {
      return {
        ...row,
        europePmcId: relevantEntry.id,
        pmcId: relevantEntry.pmcid,
        source: relevantEntry.source,
        patentDetails: relevantEntry?.patentDetails,
        title: relevantEntry.title,
        year: relevantEntry.pubYear,
        abstract: relevantEntry.abstractText,
        authors: relevantEntry.authorList?.author || [],
        isOpenAccess: relevantEntry.isOpenAccess === "Y",
        fullTextOpen: !!(
          relevantEntry.inEPMC === "Y" || relevantEntry.inPMC === "Y"
        ),
        journal: {
          ...relevantEntry.journalInfo,
          page: relevantEntry.pageInfo,
        },
      };
    }
    return row;
  });

  return mergedRows;
}

/*
 * EuropePMC widget does NOT require the count prop
 */
function Body({ id, label, entity }) {
  const { ensgId, efoId } = id;
  const pagesToFetch = 10;
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [literatureData, setLiteratureData] = useState([]);
  const [newIds, setNewIds] = useState([]);
  const variables = { ensemblId: ensgId, efoId, size: pageSize * pagesToFetch };
  const {
    loading: isLoading,
    error,
    data,
    fetchMore,
    refetch,
  } = useQuery(EUROPE_PMC_QUERY, {
    variables,
    onCompleted: (res) => {
      setNewIds(res.disease.europePmc.rows.map((entry) => entry.literature[0]));
    },
  });
  const [loading, setLoading] = useState(isLoading);

  const handlePageChange = (pageChange) => {
    if (
      pageChange * pageSize >= data.disease.europePmc.rows.length - pageSize &&
      (pageChange + 1) * pageSize < data.disease.europePmc.count
    ) {
      setLoading(true); // fetchMore takes too long to set loading to true.
      fetchMore({
        variables: {
          ...variables,
          cursor: data.disease.europePmc.cursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          setNewIds(
            fetchMoreResult.disease.europePmc.rows.map(
              (entry) => entry.literature[0]
            )
          );

          return {
            ...prev,
            disease: {
              ...prev.disease,
              europePmc: {
                ...prev.disease.europePmc,
                cursor: fetchMoreResult.disease.europePmc.cursor,
                rows: [
                  ...prev.disease.europePmc.rows,
                  ...fetchMoreResult.disease.europePmc.rows,
                ],
              },
            },
          };
        },
      });
    }

    setPage(pageChange);
  };

  const handleRowsPerPageChange = (newPageSize) => {
    setLoading(true);
    if (
      page * newPageSize >=
      data.disease.europePmc.rows.length - newPageSize
    ) {
      refetch(variables);
    }

    setPage(0);
    setPageSize(newPageSize);
  };

  useEffect(() => {
    let isCurrent = true;

    async function fetchLiterature() {
      setLoading(true);

      if (newIds.length) {
        const queryUrl = europePmcLiteratureQuery(newIds);
        const res = await fetch(queryUrl);
        const resJson = await res.json();
        const newLiteratureData = resJson.resultList.result;

        setLiteratureData((litData) => [...litData, ...newLiteratureData]);
      }
      setLoading(false);
    }

    if (isCurrent) fetchLiterature();

    return () => {
      isCurrent = false;
    };
  }, [newIds]);

  const columns = getColumns(label);

  return (
    <SectionItem
      definition={definition}
      entity={entity}
      chipText={dataTypesMap.literature}
      request={{ loading, error, data }}
      renderDescription={() => (
        <Description symbol={label.symbol} name={label.name} />
      )}
      renderBody={(res) => {
        const rows = mergeData(
          getPage(res.disease.europePmc.rows, page, pageSize),
          literatureData
        );

        return (
          <Table
            loading={loading}
            columns={columns}
            dataDownloader
            dataDownloaderFileStem={`otgenetics-${ensgId}-${efoId}`}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            page={page}
            pageSize={pageSize}
            rows={rows}
            rowCount={data.disease.europePmc.count}
            rowsPerPageOptions={[5, 10, 15, 20, 25]}
            query={EUROPE_PMC_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export default Body;
