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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Tooltip } from "ui";

import useAotfContext from "../hooks/useAotfContext";
import ValidationQuery from "./ValidationQuery.gql";
import client from "../../../client";
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

const uploadSuggestions = {
  target: ["ENSG00000232810", "interleukin 6", "TP53", "ENSG00000105329", "P15692", "CD4"],
  disease: ["EFO_0000508", "neoplasm", "MONDO_0004992", "EFO_0000182", "infection", "OBI_1110021"],
};

const FileExample = ({ entity = "target", runAction }) => {
  const examples = uploadSuggestions[entity];

  const [open, setExpanded] = useState(false);

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
            <SuggestionBlockHeader>
              <Typography variant="monoText" display="block">
                fileName.txt
              </Typography>
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
              {examples.map(ex => (
                <Typography key={v1()} variant="monoText" display="block" gutterBottom>
                  {ex}
                </Typography>
              ))}
            </SuggestionContainer>
          </Box>
        </AccordionDetails>
      </BorderAccordion>
    </Box>
  );
};

function DataUploader({ fileStem }) {
  const [activeStep, setActiveStep] = useState(0);
  const [queryTermsResults, setQueryTermsResults] = useState(null);
  const { entityToGet, pinnedEntries, setPinnedEntries } = useAotfContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "text/html": [".txt"],
    },
    onDrop: async ([file]) => {
      var reader = new FileReader();
      reader.onload = async function (e) {
        const contents = e.target.result;
        const terms = contents.split("\n");
        const result = await getValidationResults([entityToGet], terms);
        setQueryTermsResults(result.data.mapIds.mappings);
        setActiveStep(1);
      };
      reader.readAsText(file);
    },
  });

  const handleRunExample = async terms => {
    const result = await getValidationResults([entityToGet], terms);
    setQueryTermsResults(result.data.mapIds.mappings);
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
        allHits.push(hit.id);
      }
    }
    setPinnedEntries([...pinnedEntries, ...allHits]);
    handleClosePopover();
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
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

  return (
    <div>
      <Tooltip placement="bottom" title={`Upload list of ${entityToUploadLabel}`}>
        <Button
          aria-describedby={popoverId}
          onClick={handleClickBTN}
          variant="outlined"
          disableElevation
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
        <DialogContent>
          <Typography
            sx={{ m: theme => `${theme.spacing(1)} 0 ${theme.spacing(4)} 0` }}
            variant="subtitle2"
            gutterBottom
          >
            Please upload a text file here containing your custom list of targets/diseases. The file
            should contain a single {entityToGet} in every row. You will be able to visualise all
            the potential matches upon validation of your input. <br />
            <Link
              to="https://home.opentargets.org/aotf-documentation#upload-to-associations-on-the-fly"
              external
            >
              Read more details here.
            </Link>
          </Typography>
          <FileExample entity={entityToGet} runAction={handleRunExample} />
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
                  <p>Drag and drop a .txt file here, or click to select file</p>
                </div>
              </StyledContainer>
            </>
          )}
          {activeStep === 1 && (
            <Box>
              <Box sx={{ maxHeight: "40vh", overflowY: "scroll" }}>
                <List
                  sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                      Validation mappings
                    </ListSubheader>
                  }
                >
                  {queryTermsResults.map(({ term, hits }) => (
                    <NestedItem key={v1()} hits={hits}>
                      {`${term} - ${hits.length} hits`}
                    </NestedItem>
                  ))}
                </List>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button
                  aria-describedby={popoverId}
                  variant="outlined"
                  disableElevation
                  startIcon={<FontAwesomeIcon icon={faChevronLeft} size="lg" />}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  aria-describedby={popoverId}
                  variant="outlined"
                  disableElevation
                  startIcon={<FontAwesomeIcon icon={faCheck} size="lg" />}
                  onClick={handlePinElements}
                >
                  Pin hits
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DataUploader;
