import { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Skeleton } from '@mui/material';
import {
  Link,
  Table,
  PartnerLockIcon,
  useBatchDownloader,
  usePermissions,
  Legend,
} from 'ui';
import AssocCell from '../../components/AssocCell';
import dataTypes from '../../dataTypes';
import client from '../../client';
import config from '../../config';

import TARGET_ASSOCIATIONS_QUERY from './TargetAssociations.gql';

const useStyles = makeStyles(theme => ({
  root: {
    overflow: 'visible',
    padding: '2rem 3rem 0 0 !important',
  },
  table: {
    tableLayout: 'fixed !important',
  },
  sortLabel: {
    top: '8px',
  },
  innerLabel: {
    position: 'absolute',
    display: 'inline-block',
    transformOrigin: '0 0',
    bottom: 0,
    transform: 'rotate(310deg)',
    marginBottom: '5px',
  },
  nameHeaderCell: {
    width: '20%',
    borderBottom: '0 !important',
    height: '140px !important',
    verticalAlign: 'bottom !important',
    textAlign: 'end',
    paddingBottom: '.4rem',
  },
  headerCell: {
    position: 'relative',
    borderBottom: '0 !important',
    height: '140px !important',
    whiteSpace: 'nowrap',
    textAlign: 'center !important',
    verticalAlign: 'bottom !important',
  },
  overallCell: {
    border: '0 !important',
    textAlign: 'center !important',
    paddingTop: '1px !important',
    paddingBottom: '1px !important',
    paddingLeft: '1px !important',
    paddingRight: '10px !important',
  },
  cell: {
    border: '0 !important',
    height: '20px !important',
    textAlign: 'center !important',
    padding: '1px 1px !important',
    '&:last-child': {
      paddingRight: 0,
    },
  },
  colorSpan: {
    display: 'block',
    height: '20px',
    border: '1px solid #eeefef',
  },
  nameCell: {
    border: '0 !important',
    width: '20%',
    padding: '0 0.5rem 0 0 !important',
    '&:first-child': {
      paddingLeft: 0,
    },
  },
  nameContainer: {
    display: 'block',
    textAlign: 'end',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.text.primary,
    },
  },
}));

function getColumns(ensemblId, classes, isPartnerPreview) {
  const columns = [
    {
      id: 'name',
      label: 'Name',
      classes: {
        headerCell: classes.nameHeaderCell,
        cell: classes.nameCell,
      },
      exportValue: data => data.disease.name,
      renderCell: row => (
        <Link
          to={`/evidence/${ensemblId}/${row.efoId}`}
          className={classes.nameContainer}
        >
          <span title={row.name}>{row.name}</span>
        </Link>
      ),
    },
    {
      id: 'score',
      label: 'Overall association score',
      classes: {
        headerCell: classes.headerCell,
        cell: classes.overallCell,
        sortLabel: classes.sortLabel,
        innerLabel: classes.innerLabel,
      },
      sortable: true,
      renderCell: ({ score, efoId }) => (
        <AssocCell score={score} ensemblId={ensemblId} efoId={efoId} />
      ),
    },
  ];

  // datatypes columns are filtered based on config
  // for hide and private (partner) options (i.e.
  // certain columns will be hidden)
  dataTypes
    .filter(
      dt =>
        (config.profile.hideDataTypes.length === 0 ||
          !config.profile.hideDataTypes.includes(dt.id)) &&
        (!dt.isPrivate || (dt.isPrivate && isPartnerPreview))
    )
    .forEach(dt => {
      columns.push({
        id: dt.id,
        label: (
          <>
            {dt.label} {dt.isPrivate ? <PartnerLockIcon /> : null}
          </>
        ),
        exportLabel: `${dt.label} ${dt.isPrivate ? 'Private' : ''}`,
        classes: {
          headerCell: classes.headerCell,
          innerLabel: classes.innerLabel,
          sortLabel: classes.sortLabel,
          cell: classes.cell,
        },
        exportValue: data => {
          const datatypeScore = data.datatypeScores.find(
            DTScore => DTScore.componentId === dt.id
          );
          return datatypeScore ? datatypeScore.score : 'No data';
        },
        sortable: true,
        renderCell: row => (
          <AssocCell
            score={row[dt.id]}
            ensemblId={ensemblId}
            efoId={row.efoId}
          />
        ),
      });
    });

  return columns;
}

function getRows(data) {
  return data.map(d => {
    const row = {
      name: d.disease.name,
      efoId: d.disease.id,
      score: d.score,
    };
    dataTypes.forEach(dataType => {
      const dataTypeScore = d.datatypeScores.find(
        DTScore => DTScore.componentId === dataType.id
      );

      if (dataTypeScore) {
        row[dataType.id] = dataTypeScore.score;
      }
    });
    return row;
  });
}

function ClassicAssociationsTable({ ensgId, aggregationFilters }) {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState();
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const { isPartnerPreview } = usePermissions();

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    client
      .query({
        query: TARGET_ASSOCIATIONS_QUERY,
        variables: {
          ensemblId: ensgId,
          index: 0,
          size: pageSize,
          sortBy,
          filter,
          aggregationFilters,
        },
      })
      .then(({ data }) => {
        if (isCurrent) {
          setRows(data.target.associatedDiseases.rows);
          setCount(data.target.associatedDiseases.count);
          setPage(0);
          setInitialLoading(false);
          setLoading(false);
        }
      });
    return () => {
      isCurrent = false;
    };
  }, [ensgId, pageSize, sortBy, filter, aggregationFilters]);

  const getAllAssociations = useBatchDownloader(
    TARGET_ASSOCIATIONS_QUERY,
    {
      ensemblId: ensgId,
      filter: filter === '' ? null : filter,
      sortBy,
      aggregationFilters,
    },
    'data.target.associatedDiseases'
  );

  const handlePageChange = pageChanged => {
    setLoading(true);
    client
      .query({
        query: TARGET_ASSOCIATIONS_QUERY,
        variables: {
          ensemblId: ensgId,
          index: pageChanged,
          size: pageSize,
          sortBy,
          filter,
          aggregationFilters,
        },
      })
      .then(({ data }) => {
        setRows(data.target.associatedDiseases.rows);
        setPage(pageChanged);
        setLoading(false);
      });
  };

  const handleRowsPerPageChange = pageSizeChanged => {
    const newPageSize = Number(pageSizeChanged);
    setPageSize(newPageSize);
  };

  const handleSort = sortChanged => {
    setSortBy(sortChanged);
  };

  const handleGlobalFilterChange = newFilter => {
    if (newFilter !== filter) {
      setFilter(newFilter);
    }
  };

  if (initialLoading) return <Skeleton variant="rect" height="40vh" />;

  const columns = getColumns(ensgId, classes, isPartnerPreview);
  const processedRows = getRows(rows);

  return (
    <>
      <Table
        hover
        showGlobalFilter
        loading={loading}
        dataDownloader
        dataDownloaderRows={getAllAssociations}
        dataDownloaderFileStem={`${ensgId}-associated-targets`}
        classes={{ root: classes.root, table: classes.table }}
        page={page}
        sortBy={sortBy}
        order="asc"
        columns={columns}
        rows={processedRows}
        pageSize={pageSize}
        rowCount={count}
        rowsPerPageOptions={[10, 50, 200, 500]}
        onGlobalFilterChange={handleGlobalFilterChange}
        onSortBy={handleSort}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      <Legend />
    </>
  );
}

export default ClassicAssociationsTable;
