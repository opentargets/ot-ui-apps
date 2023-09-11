import { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Skeleton } from '@mui/material';
import Link from '../../components/Link';
import { Table } from '../../components/Table';
import AssocCell from '../../components/AssocCell';
import Legend from '../../components/Legend';
import useBatchDownloader from '../../hooks/useBatchDownloader';
import dataTypes from '../../dataTypes';
import client from '../../client';
import config from '../../config';
import PartnerLockIcon from '../../components/PartnerLockIcon';

import DISEASE_ASSOCIATIONS_QUERY from './DiseaseAssociations.gql';
import usePermissions from '../../hooks/usePermissions';

const useStyles = makeStyles(theme => ({
  root: {
    overflow: 'visible',
    padding: '2rem 2rem 0 0 !important',
  },
  table: {
    tableLayout: 'fixed !imortant',
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
  symbolHeaderCell: {
    width: '10% !important',
    borderBottom: '0 !important',
    height: '140px !important',
    verticalAlign: 'bottom !important',
    textAlign: 'end !important',
    paddingBottom: '.4rem',
  },
  nameHeaderCell: {
    width: '20%',
    borderBottom: '0 !important',
    height: '140px !important',
    verticalAlign: 'bottom !important',
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
  symbolCell: {
    border: '0 !important',
    width: '20%',
    padding: '0 0.5rem 0 0 !important',
  },
  nameCell: {
    border: '0 !important',
    width: '10%',
    padding: '0 0 0 0.5rem !important',
  },
  symbolContainer: {
    display: 'block',
    textAlign: 'end !important',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.text.primary,
    },
  },
  nameContainer: {
    display: 'block',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.text.primary,
    },
  },
}));

function getColumns(efoId, classes, isPartnerPreview) {
  const columns = [
    {
      id: 'symbol',
      label: 'Symbol',
      classes: {
        headerCell: classes.symbolHeaderCell,
        cell: classes.symbolCell,
      },
      exportValue: data => data.target.approvedSymbol,
      renderCell: row => (
        <Link
          to={`/evidence/${row.ensemblId}/${efoId}`}
          className={classes.symbolContainer}
        >
          {row.symbol}
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
      renderCell: ({ score, ensemblId }) => (
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
            ensemblId={row.ensemblId}
            efoId={efoId}
          />
        ),
      });
    });

  columns.push({
    id: 'name',
    label: 'Target name',
    classes: {
      headerCell: classes.nameHeaderCell,
      cell: classes.nameCell,
    },
    exportValue: data => data.target.approvedName,
    hidden: ['smDown', 'lgOnly'],
    renderCell: row => (
      <Link
        to={`/evidence/${row.ensemblId}/${efoId}`}
        className={classes.nameContainer}
      >
        <span title={row.name}>{row.name}</span>
      </Link>
    ),
  });

  return columns;
}

function getRows(data) {
  return data.map(d => {
    const row = {
      ensemblId: d.target.id,
      symbol: d.target.approvedSymbol,
      name: d.target.approvedName,
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

function ClassicAssociationsTable({ efoId, aggregationFilters }) {
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
        query: DISEASE_ASSOCIATIONS_QUERY,
        variables: {
          efoId,
          index: 0,
          size: pageSize,
          sortBy,
          filter,
          aggregationFilters,
        },
      })
      .then(({ data }) => {
        if (isCurrent) {
          setRows(data.disease.associatedTargets.rows);
          setCount(data.disease.associatedTargets.count);
          setPage(0);
          setInitialLoading(false);
          setLoading(false);
        }
      });
    return () => {
      isCurrent = false;
    };
  }, [efoId, pageSize, sortBy, filter, aggregationFilters]);

  const getAllAssociations = useBatchDownloader(
    DISEASE_ASSOCIATIONS_QUERY,
    {
      efoId,
      filter: filter === '' ? null : filter,
      sortBy,
      aggregationFilters,
    },
    'data.disease.associatedTargets'
  );

  const handlePageChange = pageChanged => {
    setLoading(true);
    client
      .query({
        query: DISEASE_ASSOCIATIONS_QUERY,
        variables: {
          efoId,
          index: pageChanged,
          size: pageSize,
          sortBy,
          filter,
          aggregationFilters,
        },
      })
      .then(({ data }) => {
        setRows(data.disease.associatedTargets.rows);
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

  const columns = getColumns(efoId, classes, isPartnerPreview);
  const processedRows = getRows(rows);

  if (initialLoading) return <Skeleton variant="rect" height="40vh" />;

  return (
    <>
      <Table
        hover
        showGlobalFilter
        loading={loading}
        dataDownloader
        dataDownloaderRows={getAllAssociations}
        dataDownloaderFileStem={`${efoId}-associated-diseases`}
        classes={{ root: classes.root, table: classes.table }}
        sortBy={sortBy}
        order="asc"
        page={page}
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
