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
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { styled } from "@mui/material/styles";
import { v1 } from "uuid";
import { faFileImport, faChevronLeft, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "ui";

import useAotfContext from "../hooks/useAotfContext";
import ValidationQuery from "./ValidationQuery.gql";
import client from "../../../client";
import NestedItem from "./NestedItem";

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
            Upload a text file containing a list of interested targets / diseases. The file should
            contain a single entity in every row. All the potential matches will be included after
            the validation of the input
          </Typography>
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
            <StyledContainer>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <p>Drag and drop a .txt file here, or click to select file</p>
              </div>
            </StyledContainer>
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
