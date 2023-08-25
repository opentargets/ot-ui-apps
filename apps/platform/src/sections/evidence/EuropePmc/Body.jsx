import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';

import Description from './Description';
import { europePmcLiteratureQuery } from '../../../utils/urls';
import { dataTypesMap } from '../../../dataTypes';
import { getPage, Table } from '../../../components/Table';
import Link from '../../../components/Link';
import { naLabel } from '../../../constants';
import Publication from './Publication';
import SectionItem from '../../../components/Section/SectionItem';
import Summary from './Summary';
import usePlatformApi from '../../../hooks/usePlatformApi';
import EUROPE_PMC_QUERY from './sectionQuery.gql';

const getColumns = label => [
  {
    id: 'disease',
    label: 'Disease/phenotype',
    renderCell: ({ disease }) => (
      <Link to={`/disease/${disease.id}`}>{disease.name}</Link>
    ),
    filterValue: ({ disease }) => disease.name,
  },
  {
    id: 'publicationDetails',
    propertyPath: 'title',
    label: 'Publication',
    width: '80%',
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
        pmcId={pmcId}
        symbol={label.symbol}
        name={label.name}
      />
    ),
  },
  {
    id: 'year',
    renderCell: ({ year }) => year || naLabel,
  },
  {
    id: 'resourceScore',
    label: 'Score',
    numeric: true,
  },
];

// Merges data from platform-API and EuropePMC API.
function mergeData(rows, literatureData) {
  const mergedRows = rows.map(row => {
    const relevantEntry = literatureData.find(
      entry => entry.id === row.literature[0]
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
        isOpenAccess: relevantEntry.isOpenAccess === 'Y',
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
export function BodyCore({ definition, id, label }) {
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
    onCompleted: res => {
      setNewIds(res.disease.evidences.rows.map(entry => entry.literature[0]));
    },
  });
  const [loading, setLoading] = useState(isLoading);

  const handlePageChange = pageChange => {
    const pageChangeNum = Number(pageChange);
    if (
      pageChangeNum * pageSize >= data.disease.evidences.rows.length - pageSize &&
      (pageChangeNum + 1) * pageSize < data.disease.evidences.count
    ) {
      setLoading(true); // fetchMore takes too long to set loading to true.
      fetchMore({
        variables: {
          ...variables,
          cursor: data.disease.evidences.cursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          setNewIds(
            fetchMoreResult.disease.evidences.rows.map(
              entry => entry.literature[0]
            )
          );

          return {
            ...prev,
            disease: {
              ...prev.disease,
              evidences: {
                ...prev.disease.evidences,
                cursor: fetchMoreResult.disease.evidences.cursor,
                rows: [
                  ...prev.disease.evidences.rows,
                  ...fetchMoreResult.disease.evidences.rows,
                ],
              },
            },
          };
        },
      });
    }

    setPage(pageChange);
  };

  const handleRowsPerPageChange = newPageSize => {
    const newPageSizeNum = Number(newPageSize);
    if (
      page * newPageSizeNum >=
      data.disease.evidences.rows.length - newPageSizeNum
    ) {
      refetch(variables);
    }

    setPage(0);
    setPageSize(newPageSizeNum);
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

        setLiteratureData(litData => [...litData, ...newLiteratureData]);
        setLoading(false);
      }
    }

    if (isCurrent) fetchLiterature();

    return () => {
      isCurrent = false;
    };
  }, [newIds]);

  const columns = getColumns(label);
  const downloadColumns = [
    {
      id: 'disease',
      label: 'Disease/phenotype',
    },
    {
      id: 'title',
      label: 'Publication',
    },
    {
      id: 'europePmcId',
    },
    {
      id: 'pmcId',
    },
    {
      id: 'year',
    },
    {
      id: 'resourceScore',
      label: 'Score',
      numeric: true,
    },
  ];

  return (
    <SectionItem
      definition={definition}
      chipText={dataTypesMap.literature}
      request={{ loading, error, data }}
      renderDescription={() => (
        <Description symbol={label.symbol} name={label.name} />
      )}
      renderBody={res => {
        const rows = mergeData(
          getPage(res.disease.evidences.rows, page, pageSize),
          literatureData
        );
        const downloadData = rows.map(row => {
          return {
            ...row,
            disease: row.disease.name,
          }
        });
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
            dataDownloaderRows={downloadData}
            dataDownloaderColumns={downloadColumns}
            rowCount={data.disease.evidences.count}
            rowsPerPageOptions={[5, 10, 15, 20, 25]}
            query={EUROPE_PMC_QUERY.loc.source.body}
            variables={variables}
          />
        );
      }}
    />
  );
}

export function Body({ definition, id, label }) {
  const { data: summaryData } = usePlatformApi(
    Summary.fragments.EuropePmcSummaryFragment
  );
  const { count } = summaryData.europePmc;

  if (!count || count < 1) {
    return null;
  }

  // Note that EuropePMC widget, unlike others, does not require count
  return <BodyCore definition={definition} id={id} label={label} />;
}
