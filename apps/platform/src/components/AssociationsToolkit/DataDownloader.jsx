import FileSaver from 'file-saver';
import { useState, useMemo } from 'react';
import _ from 'lodash';
import {
  Button,
  Grid,
  Typography,
  CircularProgress,
  Snackbar,
  Slide,
  Popover,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAotfContext from './hooks/useAotfContext';
import useBatchDownloader from '../../hooks/useBatchDownloader';
import dataSources from './static_datasets/dataSourcesAssoc';

const PopoverContent = styled('div')({
  padding: '20px 25px',
});

const LabelContainer = styled('div')({
  marginBottom: 12,
});

const targetName = {
  id: 'symbol',
  label: 'Symbol',
  exportValue: data => data.target.approvedSymbol,
};

const diseaseName = {
  id: 'symbol',
  label: 'Symbol',
  exportValue: data => data.disease.name,
};

const getRowsQuerySelector = entityToGet =>
  entityToGet === 'target'
    ? 'data.disease.associatedTargets'
    : 'data.target.associatedDiseases';

const getExportedColumns = entityToGet => {
  const nameColumn = entityToGet === 'target' ? targetName : diseaseName;
  const sources = dataSources.map(({ id }) => ({
    id,
    exportValue: data => {
      const datatypeScore = data.datasourceScores.find(
        datasourceScore => datasourceScore.componentId === id
      );
      return datatypeScore ? datatypeScore.score : 'No data';
    },
  }));

  return [
    nameColumn,
    {
      id: 'score',
      label: 'Score',
      exportValue: data => data.score,
    },
    ...sources,
  ];
};

const asJSON = (columns, rows) => {
  const rowStrings = rows.map(row =>
    columns.reduce((accumulator, newKey) => {
      if (newKey.exportValue === false) return accumulator;

      const newLabel = _.camelCase(
        newKey.exportLabel || newKey.label || newKey.id
      );

      return {
        ...accumulator,
        [newLabel]: newKey.exportValue
          ? newKey.exportValue(row)
          : _.get(row, newKey.propertyPath || newKey.id, ''),
      };
    }, {})
  );

  return JSON.stringify(rowStrings);
};

const getHeaderString = ({ columns, quoteString, separator }) =>
  columns
    .reduce((headerString, column) => {
      if (column.exportValue === false) return headerString;

      const newLabel = quoteString(
        _.camelCase(column.exportLabel || column.label || column.id)
      );

      return [...headerString, newLabel];
    }, [])
    .join(separator);

const asDSV = (columns, rows, separator = ',', quoteStrings = true) => {
  const quoteString = d => {
    let result = d;
    // converts arrays to strings
    if (Array.isArray(d)) {
      result = d.join(',');
    }
    return quoteStrings && typeof result === 'string' ? `"${result}"` : result;
  };

  const lineSeparator = '\n';

  const headerString = getHeaderString({ columns, quoteString, separator });

  const rowStrings = rows
    .map(row =>
      columns
        .reduce((rowString, column) => {
          if (column.exportValue === false) return rowString;

          const newValue = quoteString(
            column.exportValue
              ? column.exportValue(row)
              : _.get(row, column.propertyPath || column.id, '')
          );

          return [...rowString, newValue];
        }, [])
        .join(separator)
    )
    .join(lineSeparator);

  return [headerString, rowStrings].join(lineSeparator);
};

const createBlob = format =>
  ({
    json: (columns, rows) =>
      new Blob([asJSON(columns, rows)], {
        type: 'application/json;charset=utf-8',
      }),
    csv: (columns, rows) =>
      new Blob([asDSV(columns, rows)], {
        type: 'text/csv;charset=utf-8',
      }),
    tsv: (columns, rows) =>
      new Blob([asDSV(columns, rows, '\t', false)], {
        type: 'text/tab-separated-values;charset=utf-8',
      }),
  }[format]);

const styles = makeStyles(theme => ({
  messageProgress: {
    marginRight: '1rem',
  },
  snackbarContentMessage: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '.75rem 1rem',
    width: '100%',
  },
  snackbarContentRoot: {
    padding: 0,
  },
  backdrop: {
    '& .MuiBackdrop-root': {
      opacity: '0 !important',
    },
  },
  container: {
    width: '80%',
    backgroundColor: theme.palette.grey[300],
  },
  paper: {
    margin: '1.5rem',
    padding: '1rem',
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderBottom: '1px solid #ccc',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    padding: '1rem',
  },
  playgroundContainer: {
    margin: '0 1.5rem 1.5rem 1.5rem',
    height: '100%',
  },
}));

function DataDownloader({ fileStem }) {
  const [downloading, setDownloading] = useState(false);
  const classes = styles();
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    id,
    query,
    searhFilter,
    sorting,
    enableIndirect,
    entityToGet,
    displayedTable,
  } = useAotfContext();

  const columns = useMemo(() => getExportedColumns(entityToGet), [entityToGet]);
  const queryResponseSelector = useMemo(
    () => getRowsQuerySelector(entityToGet),
    [entityToGet]
  );

  const getAllAssociations = useBatchDownloader(
    query,
    {
      id,
      filter: searhFilter,
      sortBy: sorting[0].id,
      enableIndirect,
    },
    queryResponseSelector
  );

  const isPrioritisation = displayedTable === 'prioritisations';

  const open = Boolean(anchorEl);
  const popoverId = open ? 'dowloader-popover' : undefined;

  const downloadData = async (format, dataColumns, rows, dataFileStem) => {
    let allRows = rows;
    if (typeof rows === 'function') {
      setDownloading(true);
      allRows = await rows();
      setDownloading(false);
    }
    if (!allRows || allRows.length === 0) {
      return;
    }
    const blob = createBlob(format)(dataColumns, allRows);
    FileSaver.saveAs(blob, `${dataFileStem}.${format}`, { autoBOM: false });
  };

  const handleClickBTN = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleClickDownloadJSON = async () => {
    downloadData('json', columns, getAllAssociations, fileStem);
  };

  const handleClickDownloadTSV = async () => {
    downloadData('tsv', columns, getAllAssociations, fileStem);
  };

  return (
    <div>
      <Button
        aria-describedby={popoverId}
        onClick={handleClickBTN}
        variant="outlined"
        disableElevation
        disabled={isPrioritisation}
        startIcon={<FontAwesomeIcon icon={faCloudArrowDown} size="lg" />}
      >
        Export
      </Button>
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <PopoverContent>
          <LabelContainer>
            <Typography variant="caption">Download data as</Typography>
          </LabelContainer>
          <Grid container alignItems="center" spacing={3}>
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleClickDownloadJSON}
                size="small"
              >
                JSON
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleClickDownloadTSV}
                size="small"
              >
                TSV
              </Button>
            </Grid>
          </Grid>
        </PopoverContent>
      </Popover>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={downloading}
        TransitionComponent={Slide}
        ContentProps={{
          classes: {
            root: classes.snackbarContentRoot,
            message: classes.snackbarContentMessage,
          },
        }}
        message={
          <>
            <CircularProgress className={classes.messageProgress} />
            Preparing data...
          </>
        }
      />
    </div>
  );
}

export default DataDownloader;
