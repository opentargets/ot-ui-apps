import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  List,
  ListSubheader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton,
  Snackbar,
  IconButton,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { styled } from "@mui/material/styles";
import { v1 } from "uuid";
import {
  faFileImport,
  faChevronLeft,
  faCheck,
  faChevronDown,
  faClipboard,
  faPlay,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Tooltip } from "ui";
import * as XLSX from "xlsx";

import useAotfContext from "../../hooks/useAotfContext";
import ValidationQuery from "./ValidationQuery.gql";
import client from "../../../../client";
import NestedItem from "./NestedItem";

const BorderAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: "none",
  border: `1px solid ${theme.palette.primary.light}`,
  borderRadius: `${theme.spacing(1)} !important`,
}));

const StyledContainer = styled("div")`
  .dropzone {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-width: 2px;
    border-radius: 2px;
    border-color: #eeeeee;
    border-style: dashed;
    background-color: #fafafa;
    color: #bdbdbd;
    outline: none;
    transition: border 0.24s ease-in-out;
    margin-bottom: 16px;
    cursor: pointer;
  }
  .dropzone:focus {
    border-color: #3489ca;
  }
`;

const SuggestionBlockHeader = styled("div")`
  background-color: #cccccc;
  border-radius: 8px 8px 0px 0px;
  border-width: 2px;
  border-style: solid;
  border-color: #cccccc;
  padding: 5px;
  padding-left: 20px;
`;

const SuggestionContainer = styled("div")`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-width: 2px;
  border-color: #eeeeee;
  border-style: solid;
  border-radius: 0px 0px 8px 8px;
  background-color: #fafafa;
  border-top: none;
`;

const steps = ["Add a file", "Entity validation"];

const getEntityToUploadLabel = {
  target: "targets",
  disease: "diseases",
};

const getValidationResults = async (entity, queryTerms) =>
  client.query({
    query: ValidationQuery,
    variables: { entity, queryTerms },
  });

function formatQueryTermsResults(queryResult) {
  const sortedResult = [...queryResult.data.mapIds.mappings].sort(function (a, b) {
    return a.hits.length < b.hits.length ? 1 : -1;
  });
  const parsedResult = sortedResult.map(qT => {
    const parsedQueryTerm = {
      ...qT,
      hits: [...qT.hits.map(e => ({ ...e, checked: true }))],
    };
    return parsedQueryTerm;
  });

  return parsedResult;
}

const uploadSuggestions = {
  target: ["ENSG00000232810", "interleukin 6", "TP53", "ENSG00000105329", "P15692", "CD4"],
  disease: ["EFO_0000508", "neoplasm", "MONDO_0004992", "EFO_0000182", "infection", "OBI_1110021"],
};

const FileExample = ({ entity = "target", runAction }) => {
  const examples = uploadSuggestions[entity];

  const [open, setExpanded] = useState(false);
  const [fileType, setFileType] = useState("text");

  const handleFileTypeChange = (event, newFileType) => {
    setFileType(newFileType);
  };

  const handleChange = () => {
    setExpanded(open ? false : true);
  };

  function handleClickRun() {
    runAction(examples);
    setExpanded(false);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(JSON.stringify(examples));
  }
  return (
    <Box sx={{ mb: 6 }}>
      <BorderAccordion expanded={open} onChange={() => handleChange()}>
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
          expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
        >
          <Typography>Example format</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <code>
              <SuggestionBlockHeader>
                <Typography variant="monoText" display="inline">
                  File type:
                </Typography>
                <ToggleButtonGroup
                  color="primary"
                  value={fileType}
                  exclusive
                  onChange={handleFileTypeChange}
                  aria-label="File Example"
                  sx={{ ml: 2, background: "white" }}
                >
                  <ToggleButton value="text">.txt</ToggleButton>
                  <ToggleButton value="spreadsheet">.csv /.tsv /.xlsx</ToggleButton>
                  <ToggleButton value="json">.json</ToggleButton>
                </ToggleButtonGroup>
              </SuggestionBlockHeader>
              <SuggestionContainer>
                <Box sx={{ position: "absolute", right: 10, display: "flex", gap: 1 }}>
                  <Tooltip placement="bottom" title="Run this sample">
                    <Button onClick={() => handleClickRun()}>
                      <FontAwesomeIcon icon={faPlay} />
                    </Button>
                  </Tooltip>
                  <Tooltip placement="bottom" title="Copy to clipboard">
                    <Button onClick={() => copyToClipboard()}>
                      <FontAwesomeIcon icon={faClipboard} />
                    </Button>
                  </Tooltip>
                </Box>
                <Box>
                  {fileType === "json" && (
                    <>
                      [
                      {examples.map(ex => (
                        <Typography key={v1()} variant="monoText" display="block" gutterBottom>
                          {`"${ex}",`}
                        </Typography>
                      ))}
                      ]
                    </>
                  )}
                  {fileType === "text" &&
                    examples.map(ex => (
                      <Typography key={v1()} variant="monoText" display="block" gutterBottom>
                        {ex}
                      </Typography>
                    ))}
                  {fileType === "spreadsheet" && (
                    <table style={{ border: "1px solid black", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ border: "1px solid black", borderCollapse: "collapse" }}>
                          <th>id</th>
                        </tr>
                      </thead>
                      <tbody>
                        {examples.map(ex => (
                          <tr
                            key={v1()}
                            style={{ border: "1px solid black", borderCollapse: "collapse" }}
                          >
                            <td>
                              <Typography variant="monoText" display="block" gutterBottom>
                                {ex}
                              </Typography>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </Box>
              </SuggestionContainer>
            </code>
          </Box>
        </AccordionDetails>
      </BorderAccordion>
    </Box>
  );
};

function DataUploader() {
  const [activeStep, setActiveStep] = useState(0);
  const [queryTermsResults, setQueryTermsResults] = useState(null);
  const { entityToGet, pinnedEntries, setPinnedEntries } = useAotfContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "text/html": [".txt"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".csv",
        ".tsv",
        ".xlsx",
      ],
      "application/JSON": [".json"],
    },
    onDrop: async ([file]) => {
      let reader = new FileReader();
      const fileType = getFileType(file.name);

      if (fileType === "spreadsheet") reader.readAsBinaryString(file);
      else if (fileType === "text") reader.readAsText(file);
      else if (fileType === "json") reader.readAsText(file);
      else setOpenErrorSnackbar(true);

      reader.onload = async function (e) {
        let contents;
        if (fileType === "spreadsheet") contents = getDataFromSpreadsheet(e);
        else if (fileType === "text") contents = getDataFromTextFile(e);
        else if (fileType === "json") contents = JSON.parse(e.target.result);
        else setOpenErrorSnackbar(true);

        const result = await getValidationResults([entityToGet], contents);
        setQueryTermsResults(formatQueryTermsResults(result));
        setActiveStep(1);
      };
    },
  });

  function getDataFromSpreadsheet(file) {
    const wb = XLSX.read(file.target.result, { type: "binary", bookVBA: true });
    /* Get first worksheet */
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    /* Convert array of arrays */
    const data = XLSX.utils.sheet_to_json(ws);

    if (!Object.prototype.hasOwnProperty.call(data[0], "id")) {
      setOpenErrorSnackbar(true);
      console.error(
        "Please ensure the uploaded file is in the correct format (see allowed file types and example format)"
      );
    }

    const terms = data.map(function (item) {
      return item["id"];
    });
    return terms;
  }

  function getDataFromTextFile(file) {
    const contents = file.target.result;
    const terms = contents.split("\n");
    return terms;
  }

  function getFileType(fileName) {
    const fileType = fileName.split(".").pop();
    switch (fileType) {
      case "csv":
        return "spreadsheet";
      case "tsv":
        return "spreadsheet";
      case "xlsx":
        return "spreadsheet";
      case "txt":
        return "text";
      case "json":
        return "json";
      default:
        return fileType;
    }
  }

  const handleRunExample = async terms => {
    const result = await getValidationResults([entityToGet], terms);
    setQueryTermsResults(formatQueryTermsResults(result));
    setActiveStep(1);
  };

  const entityToUploadLabel = getEntityToUploadLabel[entityToGet];

  const handlePinElements = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
    const allHits = [];
    for (let index = 0; index < queryTermsResults.length; index++) {
      const term = queryTermsResults[index];
      for (let r = 0; r < term.hits.length; r++) {
        const hit = term.hits[r];
        if (hit.checked) allHits.push(hit.id);
      }
    }
    setPinnedEntries([...pinnedEntries, ...allHits]);
    handleClosePopover();
  };

  const handleBack = () => {
    if (activeStep < 1) handleClosePopover();
    else setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "downloader-popover" : undefined;

  const handleClickBTN = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setQueryTermsResults(null);
    handleReset();
  };

  function handleParentChange(term) {
    const checkboxUpdateState = [...queryTermsResults];
    checkboxUpdateState.find(hitItem => {
      if (hitItem.term === term) {
        hitItem.hits.every(el => !el.checked)
          ? hitItem.hits.map(el => (el.checked = true))
          : hitItem.hits.map(el => (el.checked = false));
      }
    });
    setQueryTermsResults(checkboxUpdateState);
  }

  function handleChangeChildCheckbox(hitId) {
    const checkboxUpdateState = [...queryTermsResults];
    checkboxUpdateState.find(hitItem => {
      hitItem.hits.find(el => {
        if (el.id === hitId) return (el.checked = !el.checked);
      });
    });
    setQueryTermsResults(checkboxUpdateState);
  }

  function handleCloseErrorSnackbar() {
    setOpenErrorSnackbar(false);
  }

  return (
    <div>
      <Tooltip placement="bottom" title={`Upload list of ${entityToUploadLabel}`}>
        <Button
          aria-describedby={popoverId}
          onClick={handleClickBTN}
          variant="outlined"
          disableElevation
          sx={{ height: 1, maxHeight: "45px" }}
        >
          <FontAwesomeIcon icon={faFileImport} size="lg" />
        </Button>
      </Tooltip>
      <Dialog
        onClose={handleClosePopover}
        open={open}
        sx={{
          ".MuiDialog-paper": {
            width: "70%",
            maxWidth: "800px !important",
            borderRadius: theme => theme.spacing(1),
          },
        }}
      >
        <DialogTitle>{`Upload list of ${entityToUploadLabel}`}</DialogTitle>
        <DialogContent sx={{ pb: 0, overflowY: "scroll" }} dividers>
          <Typography
            sx={{ m: theme => `${theme.spacing(1)} 0 ${theme.spacing(4)} 0` }}
            variant="subtitle2"
            gutterBottom
          >
            Please upload a file here (allowed file formats - .txt / .csv / .tsv / .xlsx / .json)
            containing your custom list of targets/diseases. The file should contain a single{" "}
            {entityToGet} in every row. You will be able to visualise all the potential matches upon
            validation of your input.
            <br />
            <Link
              to="https://platform-docs.opentargets.org/web-interface/associations-on-the-fly#upload-functionality"
              external
            >
              Read more details here.
            </Link>
          </Typography>
          {activeStep === 0 && <FileExample entity={entityToGet} runAction={handleRunExample} />}
          <Box sx={{ m: theme => `${theme.spacing(1)} 0 ${theme.spacing(4)} 0` }}>
            <Stepper activeStep={activeStep}>
              {steps.map(label => {
                const stepProps = {};
                const labelProps = {};
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Box>

          {activeStep === 0 && (
            <>
              <StyledContainer>
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  <p>Drag and drop a file here, or click to select file (see example format).</p>
                </div>
              </StyledContainer>
            </>
          )}
          {activeStep === 1 && (
            <Box>
              <Box sx={{ overflowY: "scroll" }}>
                <List
                  sx={{ width: "100%", maxWidth: 1, bgcolor: "background.paper" }}
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <ListSubheader sx={{ px: 1.5 }} component="div" id="nested-list-subheader">
                      Validation mappings ( Upload count: {queryTermsResults.length})
                    </ListSubheader>
                  }
                >
                  {queryTermsResults.map(({ term, hits }) => (
                    <NestedItem
                      key={v1()}
                      hits={hits}
                      term={term}
                      handleParentChange={handleParentChange}
                      handleChangeChildCheckbox={handleChangeChildCheckbox}
                    >
                      {`${term} (${hits.length} hits)`}
                    </NestedItem>
                  ))}
                </List>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Box sx={{ display: "flex", justifyContent: "space-between", mx: 2, my: 1, width: 1 }}>
            <Button
              aria-describedby={popoverId}
              variant="outlined"
              disableElevation
              startIcon={<FontAwesomeIcon icon={faChevronLeft} size="lg" />}
              onClick={handleBack}
            >
              Back
            </Button>
            {activeStep === 1 && (
              <Button
                aria-describedby={popoverId}
                variant="outlined"
                disableElevation
                startIcon={<FontAwesomeIcon icon={faCheck} size="lg" />}
                onClick={handlePinElements}
              >
                Pin hits
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={10000}
        onClose={handleCloseErrorSnackbar}
        message={
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Please ensure the uploaded file has id in column header (see example format)
            <IconButton sx={{ color: "white" }} onClick={handleCloseErrorSnackbar}>
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </Box>
        }
      />
    </div>
  );
}

export default DataUploader;
