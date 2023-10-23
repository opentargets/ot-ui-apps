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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import {
  faCloudArrowDown,
  faLink,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePermissions } from 'ui';
import useBatchDownloader from './hooks/useBatchDownloader';
import useAotfContext from './hooks/useAotfContext';
import OriginalDataSources from './static_datasets/dataSourcesAssoc';
import prioritizationCols from './static_datasets/prioritizationCols';

const { isPartnerPreview } = usePermissions();

const dataSources = OriginalDataSources.filter(e => {
  if (isPartnerPreview && e.isPrivate) {
    return e;
  } else if (!e.isPrivate) return e;
  return;
});

const LabelContainer = styled('div')({
  marginBottom: 12,
});

const BorderAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: 'none',
  border: `1px solid ${theme.palette.primary.light}`,
}));

const BlueAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  background: theme.palette.primary.light,
  div: {
    color: 'white',
  },
}));

AccordionSummary;

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

const getExportedColumns = (entityToGet, assocArr, prioArr) => {
  const nameColumn = entityToGet === 'target' ? targetName : diseaseName;
  let exportedColumns = [];
  const sources = assocArr.map(({ id }) => ({
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
    const prioritisationExportCols = prioArr.map(({ id }) => ({
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

const getExportedPrioritisationColumns = arr => {
  let exportedColumns = [];

  const prioritisationExportCols = arr.map(({ id }) => ({
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
  const allAssociationsAggregation = [
    ...new Set(dataSources.map(e => e.aggregation)),
  ];
  const allPrioritizationAggregation = [
    ...new Set(prioritizationCols.map(e => e.aggregation)),
  ];

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

  const [selectedAssociationColumns, setSelectedAssociationColumns] = useState([
    ...dataSources,
  ]);
  const [selectedPrioritizationColumns, setSelectedPrioritizationColumns] =
    useState(prioritizationCols);

  const [associationAggregationSelect, setAssociationAggregationSelect] =
    useState([...allAssociationsAggregation]);
  const [prioritisationAggregationSelect, setPrioritisationAggregationSelect] =
    useState([...allPrioritizationAggregation]);

  const [downloading, setDownloading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [urlSnackbar, setUrlSnackbar] = useState(false);
  const columns = useMemo(
    () =>
      getExportedColumns(
        entityToGet,
        selectedAssociationColumns,
        selectedPrioritizationColumns
      ),
    [entityToGet, selectedAssociationColumns, selectedPrioritizationColumns]
  );
  const prioritisationColumns = useMemo(
    () => getExportedPrioritisationColumns(selectedPrioritizationColumns),
    [selectedPrioritizationColumns]
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
  const popoverId = open ? 'downloader-popover' : undefined;

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

  useEffect(() => {
    const filteredValues = associationAggregationSelect.map(ag =>
      selectedAssociationColumns.filter(e => e.aggregation === ag)
    );
    setSelectedAssociationColumns([...filteredValues.flat(1)]);
  }, [associationAggregationSelect]);

  useEffect(() => {
    const filteredValues = prioritisationAggregationSelect.map(ag =>
      selectedPrioritizationColumns.filter(e => e.aggregation === ag)
    );
    setSelectedPrioritizationColumns([...filteredValues.flat(1)]);
  }, [prioritisationAggregationSelect]);

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
            <BlueAccordionSummary
              expandIcon={<FontAwesomeIcon icon={faCaretDown} size="lg" />}
            >
              <Typography variant="body1">Advanced export options:</Typography>
            </BlueAccordionSummary>
            <Divider />
            <AccordionDetails>
              <FormGroup>
                <FormControl size="small" sx={{ m: 1, maxWidth: '100%' }}>
                  <InputLabel id="select-association-small-label">
                    Associations Aggregation
                  </InputLabel>
                  <Select
                    disabled={downloading || onlyTargetData}
                    multiple
                    labelId="select-association-small-label"
                    value={associationAggregationSelect}
                    label="Associations Aggregation"
                    renderValue={selected => selected.join(', ')}
                    onChange={e => {
                      setAssociationAggregationSelect(
                        typeof e.target.value === 'string'
                          ? e.target.value.split(',')
                          : e.target.value
                      );
                    }}
                  >
                    {allAssociationsAggregation.map(ds => (
                      <MenuItem key={ds} value={ds}>
                        <Checkbox
                          checked={
                            associationAggregationSelect.indexOf(ds) > -1
                          }
                        />
                        <ListItemText primary={ds} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ m: 1, maxWidth: '100%' }}>
                  <InputLabel id="select-prioritization-small-label">
                    Prioritization Aggregation
                  </InputLabel>
                  <Select
                    disabled={downloading}
                    multiple
                    labelId="select-prioritization-small-label"
                    value={prioritisationAggregationSelect}
                    label="Prioritization Aggregation"
                    renderValue={selected => selected.join(', ')}
                    onChange={e => {
                      setPrioritisationAggregationSelect(
                        typeof e.target.value === 'string'
                          ? e.target.value.split(',')
                          : e.target.value
                      );
                    }}
                  >
                    {allPrioritizationAggregation.map(ds => (
                      <MenuItem key={ds} value={ds}>
                        <Checkbox
                          checked={
                            prioritisationAggregationSelect.indexOf(ds) > -1
                          }
                        />
                        <ListItemText primary={ds} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControlLabel
                  sx={{ pl: 1 }}
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
                  sx={{ pl: 1 }}
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
                <FormControlLabel
                  sx={{ pl: 1 }}
                  control={
                    <Checkbox
                      disabled={pinnedEntries.length <= 0 || downloading}
                      checked={onlyPinnedCheckBox}
                      onChange={e => setOnlyPinnedCheckBox(e.target.checked)}
                    />
                  }
                  label="Only pinned / upload rows"
                />

                {entity === 'disease' && (
                  <FormControlLabel
                    sx={{ pl: 1 }}
                    control={
                      <Checkbox
                        disabled={
                          downloading ||
                          prioritisationAggregationSelect.length <= 0
                        }
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <Box>
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
            </Box>
            <Box>
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
            </Box>
          </Box>
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
