import FileSaver from 'file-saver';
import { useState, useMemo, useEffect } from 'react';
import _ from 'lodash';
import {
  Button,
  Grid,
  Typography,
  Snackbar,
  Slide,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import {
  faCloudArrowDown,
  faLink,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useBatchDownloader from './hooks/useBatchDownloader';
import useAotfContext from './hooks/useAotfContext';
import dataSources from './static_datasets/dataSourcesAssoc';
import prioritizationCols from './static_datasets/prioritizationCols';

const LabelContainer = styled('div')({
  marginBottom: 12,
});

const BorderAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: "none",
  border: `1px solid ${theme.palette.grey[300]}`
}));

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
  let exportedColumns = [];
  const sources = dataSources.map(({ id }) => ({
    id,
    exportValue: data => {
      const datatypeScore = data.datasourceScores.find(
        datasourceScore => datasourceScore.componentId === id
      );
      return datatypeScore ? parseFloat(datatypeScore.score) : 'No data';
    },
  }));

  exportedColumns = [...sources];

  if (entityToGet === 'target') {
    const prioritisationExportCols = prioritizationCols.map(({ id }) => ({
      id,
      exportValue: data => {
        const prioritisationScore = data.target.prioritisation.items.find(
          prioritisationItem => prioritisationItem.key === id
        );
        return prioritisationScore
          ? parseFloat(prioritisationScore.value)
          : 'No data';
      },
    }));

    exportedColumns = [...sources, ...prioritisationExportCols];
  }

  return [
    nameColumn,
    {
      id: 'score',
      label: 'Score',
      exportValue: data => data.score,
    },
    ...exportedColumns,
  ];
};

const getExportedPrioritisationColumns = () => {
  let exportedColumns = [];

  const prioritisationExportCols = prioritizationCols.map(({ id }) => ({
    id,
    exportValue: data => {
      const prioritisationScore = data.target.prioritisation.items.find(
        prioritisationItem => prioritisationItem.key === id
      );
      return prioritisationScore
        ? parseFloat(prioritisationScore.value)
        : 'No data';
    },
  }));

  exportedColumns = [...prioritisationExportCols];

  return [
    targetName,
    {
      id: 'score',
      label: 'Score',
      exportValue: data => data.score,
    },
    ...exportedColumns,
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
    color: 'white !important',
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
  const classes = styles();
  const {
    id,
    query,
    searhFilter,
    sorting,
    enableIndirect,
    entity,
    entityToGet,
    displayedTable,
    modifiedSourcesDataControls,
    pinnedEntries,
    dataSourcesWeights,
    dataSourcesRequired,
  } = useAotfContext();
  const [onlyPinnedCheckBox, setOnlyPinnedCheckBox] = useState(false);
  const [weightControlCheckBox, setWeightControlCheckBox] = useState(
    modifiedSourcesDataControls
  );
  const [requiredControlCheckBox, setRequiredControlCheckBox] = useState(
    modifiedSourcesDataControls
  );
  const [onlyTargetData, setOnlyTargetData] = useState(false);

  const [downloading, setDownloading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [urlSnackbar, setUrlSnackbar] = useState(false);
  const columns = useMemo(() => getExportedColumns(entityToGet), [entityToGet]);
  const prioritisationColumns = useMemo(
    () => getExportedPrioritisationColumns(),
    []
  );
  const queryResponseSelector = useMemo(
    () => getRowsQuerySelector(entityToGet),
    [entityToGet]
  );

  const allAssociationsVariable = {
    id,
    filter: searhFilter,
    sortBy: sorting[0].id,
    enableIndirect,
    datasources: dataSourcesWeights,
    ...(requiredControlCheckBox && {
      aggregationFilters: dataSourcesRequired.map(el => ({
        name: el.name,
        path: el.path,
      })),
    }),
  };

  const pinnedAssociationsVariable = {
    ...allAssociationsVariable,
    rowsFilter: pinnedEntries,
  };

  const getOnlyPinnedData = useBatchDownloader(
    query,
    pinnedAssociationsVariable,
    queryResponseSelector
  );

  const getAllAssociations = useBatchDownloader(
    query,
    allAssociationsVariable,
    queryResponseSelector
  );

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
    const d = new Date().toLocaleDateString();
    FileSaver.saveAs(blob, `${dataFileStem}-${d}-v<VersionNumber>.${format}`, {
      autoBOM: false,
    });
  };

  const handleClickBTN = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleClickDownloadJSON = async () => {
    const data = onlyPinnedCheckBox ? getOnlyPinnedData : getAllAssociations;
    const columnToGet = onlyTargetData ? prioritisationColumns : columns;
    downloadData('json', columnToGet, data, fileStem);
  };

  const handleClickDownloadTSV = async () => {
    const data = onlyPinnedCheckBox ? getOnlyPinnedData : getAllAssociations;
    const columnToGet = onlyTargetData ? prioritisationColumns : columns;
    downloadData('tsv', columnToGet, data, fileStem);
  };

  useEffect(() => {
    setRequiredControlCheckBox(modifiedSourcesDataControls);
    setWeightControlCheckBox(modifiedSourcesDataControls);
  }, [modifiedSourcesDataControls]);

  return (
    <div>
      <Button
        aria-describedby={popoverId}
        onClick={handleClickBTN}
        variant="outlined"
        disableElevation
        startIcon={<FontAwesomeIcon icon={faCloudArrowDown} size="lg" />}
      >
        Export
      </Button>
      <Dialog onClose={handleClosePopover} open={open}>
        <DialogTitle>Export: {fileStem} data</DialogTitle>
        <DialogContent>
          <BorderAccordion>
            <AccordionSummary
              expandIcon={<FontAwesomeIcon icon={faCaretDown} size="lg" />}
            >
              <Typography variant="body1">Advance export options:</Typography>
            </AccordionSummary>
            <Divider/>
            <AccordionDetails>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      disabled={pinnedEntries.length <= 0 || downloading}
                      checked={onlyPinnedCheckBox}
                      onChange={e => setOnlyPinnedCheckBox(e.target.checked)}
                    />
                  }
                  label="Only pinned / upload rows"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={weightControlCheckBox}
                      disabled={!modifiedSourcesDataControls || downloading}
                      onChange={e => setWeightControlCheckBox(e.target.checked)}
                    />
                  }
                  label="Include custom weight controls"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={requiredControlCheckBox}
                      disabled={!modifiedSourcesDataControls || downloading}
                      onChange={e =>
                        setRequiredControlCheckBox(e.target.checked)
                      }
                    />
                  }
                  label="Include custom required control"
                />
                {entity === 'disease' && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        disabled={downloading}
                        checked={onlyTargetData}
                        onChange={e => setOnlyTargetData(e.target.checked)}
                      />
                    }
                    label="Only prioritisation data"
                  />
                )}
              </FormGroup>
            </AccordionDetails>
          </BorderAccordion>
          <Button
            variant="outlined"
            startIcon={<FontAwesomeIcon icon={faLink} size="2xs" />}
            onClick={() => {
              setUrlSnackbar(true);
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            Copy Url
          </Button>
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
        </DialogContent>
      </Dialog>
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
            Preparing the data. This may take several minutes...
          </>
        }
      />

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={urlSnackbar}
        onClose={() => {
          setUrlSnackbar(false);
        }}
        autoHideDuration={2000}
        TransitionComponent={Slide}
        ContentProps={{
          classes: {
            root: classes.snackbarContentRoot,
            message: classes.snackbarContentMessage,
          },
        }}
        message="URL copied"
      />
    </div>
  );
}

export default DataDownloader;
