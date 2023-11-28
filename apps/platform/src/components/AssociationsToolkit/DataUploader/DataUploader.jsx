import { useState, useReducer } from "react";
import {
  Button,
  Snackbar,
  Slide,
  CircularProgress,
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
  ListItem,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { faCloudArrowUp, faChevronLeft, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAotfContext from "../hooks/useAotfContext";
import { getFilteredColumnArray } from "../utils/downloads";
import { useDropzone } from "react-dropzone";
import ValidationQuery from "./ValidationQuery.gql";
import client from "../../../client";
import { v1 } from "uuid";
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

const styles = makeStyles(theme => ({
  messageProgress: {
    marginRight: "1rem",
    color: "white !important",
  },
  snackbarContentMessage: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: ".75rem 1rem",
    width: "100%",
  },
  snackbarContentRoot: {
    padding: 0,
  },
  backdrop: {
    "& .MuiBackdrop-root": {
      opacity: "0 !important",
    },
  },
  container: {
    width: "80%",
    backgroundColor: theme.palette.grey[300],
  },
  paper: {
    margin: "1.5rem",
    padding: "1rem",
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderBottom: "1px solid #ccc",
    fontSize: "1.2rem",
    fontWeight: "bold",
    padding: "1rem",
  },
  playgroundContainer: {
    margin: "0 1.5rem 1.5rem 1.5rem",
    height: "100%",
  },
}));

const steps = ["Add a file", "Entity validation"];

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_ASSOCIATION_COLUMNS":
      return {
        ...state,
        associationAggregationSelectValue: action.payload,
        selectedAssociationAggregationColumnObjectValue: getFilteredColumnArray(
          action.payload,
          state.selectedAssociationAggregationColumnObjectValue
        ),
      };
    case "UPDATE_PRIORITISATION_COLUMNS":
      return {
        ...state,
        prioritisationAggregationSelectValue: action.payload,
        selectedPrioritisationAggregationColumnObjectValue: getFilteredColumnArray(
          action.payload,
          state.selectedPrioritisationAggregationColumnObjectValue
        ),
      };
    default:
      return state;
  }
};

const actions = {
  UPDATE_ASSOCIATION_COLUMNS: payload => ({
    type: "UPDATE_ASSOCIATION_COLUMNS",
    payload,
  }),
  UPDATE_PRIORITISATION_COLUMNS: payload => ({
    type: "UPDATE_PRIORITISATION_COLUMNS",
    payload,
  }),
};

const getValidationResults = async (entity, queryTerms) =>
  client.query({
    query: ValidationQuery,
    variables: { entity, queryTerms },
  });

// const handleSteps = step => {
//   switch (step) {
//     case 0:
//       return <FirstStep />;
//     case 1:
//       return <SecondStep />;
//     case 2:
//       return <Confirm />;
//     default:
//       throw new Error("Unknown step");
//   }
// };

function DataUploader({ fileStem }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [activeStep, setActiveStep] = useState(0);
  const [queryTermsResults, setQueryTermsResults] = useState(null);
  const {
    id,
    entityToGet,
    modifiedSourcesDataControls,
    pinnedData,
    pinnedEntries,
    setPinnedEntries,
  } = useAotfContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "text/html": [".txt"],
    },
    onDrop: async ([file]) => {
      var reader = new FileReader();
      reader.onload = async function (e) {
        const contents = e.target.result;
        const terms = contents.split("\n");
        const result = await getValidationResults(["target"], terms);
        console.log(result.data.mapIds.mappings);
        setQueryTermsResults(result.data.mapIds.mappings);
        console.log({ queryTermsResults });
        setActiveStep(1);
      };
      reader.readAsText(file);
    },
  });

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

  const classes = styles();

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
      <Button
        aria-describedby={popoverId}
        onClick={handleClickBTN}
        variant="outlined"
        disableElevation
        startIcon={<FontAwesomeIcon icon={faCloudArrowUp} size="lg" />}
      >
        Upload
      </Button>
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
        <DialogTitle>Upload list of entities</DialogTitle>
        <DialogContent>
          <Typography
            sx={{ m: theme => `${theme.spacing(1)} 0 ${theme.spacing(4)} 0` }}
            variant="subtitle2"
            gutterBottom
          >
            By default, clicking on the download tabs from this view (JSON or TSV) will export the
            entire association table. Please expand the advanced options to customise the export
            parameters.
          </Typography>
          <Box sx={{ m: theme => `${theme.spacing(1)} 0 ${theme.spacing(4)} 0` }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
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
