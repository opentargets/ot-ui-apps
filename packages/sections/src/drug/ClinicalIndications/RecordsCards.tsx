
import { OtTable, useApolloClient } from "ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  IconButton,
  Drawer,
  Link,
  Typography,
  Paper,
  ButtonBase,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { faPlay, faXmark, faPlusCircle, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { defaultRowsPerPageOptions } from "@ot/constants";
import RECORD_DETAIL_QUERY from "./ClinicalRecordsQuery.gql";
import { sentenceCase } from "@ot/utils";

const getRecordDetail = (client, query, /* variables here */) =>   // WILL NEED TO PUT ACTUAL PARAMETERS HERE !!
  client.query({
    query,
    variables: {
       // ... AND USE THE PARAMETERS HERE
    },
});

const columns = [
  {
    id: "trial",
    label: "",
    renderCell: (record) => {
      const {
        source,
        trialDescription,
        trialStartDate,
        clinicalStatus,
        phase,
        trialLiteratures,
        type,
        trialOverallStatus,
        trialWhyStopped,
        trialStopReasonCategories,
        trialPrimaryPurpose,
        url,
        trialOfficialTitle,
        diseases,
        drugs,
      } = record;
      const diseaseIds = [...new Set(diseases.filter(d => d.diseaseId).map(d => d.diseaseId))];

      return (
        <Box sx={{ mb: 1 }}>
          <Link external="true" to={url} sx={{textDecoration: "none"}}>
            <Box sx={{ display: "flex", width: "100%" }}>
              <Typography
                variant={"subtitle1"}
                noWrap
                sx={{ 
                  minWidth: 0,
                  maxWidth: "100%",
                  width: "200px",  // !! REUIQUIRED FOR ELLIPSES - IS IT DODGY FOR SHORT TITLES? !!
                  flex: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {trialOfficialTitle || `[${sentenceCase(type)}]`}
              </Typography>
            </Box>
          </Link>

          <Box sx={{ display: "flex", mt: 0.15 }}>
            <Typography variant="caption" sx={{ width: "80px"}}>
              <span style={{ fontWeight: 500}}>{type}</span>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", mt: 0.15, alignItems: "center", justifyContent: "space-between", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ display: "flex", width: "150px", alignItems: "baseline", gap: 0.5 }}>
                <Typography variant="caption">
                  Start:
                </Typography>
                <Typography variant= "body2" sx={{width: "100px"}}>
                  {trialStartDate}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                <Typography variant="caption">
                  Status:
                </Typography>
                <Typography variant= "body2">
                  {trialOverallStatus?.toLowerCase()}
                </Typography>
              </Box>
            </Box>
            <Button
              // className={classes.detailsButton}
              variant="text"
              size="small"
              sx={{ border: "none" }}
              // disabled={!abstract}
              // onClick={handleShowAbstractClick}
              // startIcon={<FontAwesomeIcon icon={faPlusCircle} size="sm" />}
              // sx={{ my: 2 }}
            >
              <Typography variant="caption">Details</Typography>&nbsp;
              <FontAwesomeIcon size="sm" icon={faChevronRight} />
            </Button>
          </Box>
          

        
        </Box>
      );
    },
  }
];

function selectRecord({ recordId }) {
  // !! ONCE HAVE API, USE getRecordDetail TO FETCH THE RECORD DETAILS
  console.log("open detail modal!")
}

function RecordsCards({
  selectedDisease,
  records,
  // query,
  // variables,
  // loading,
}) {

  const client = useApolloClient();

  return (
    <>
      <Typography variant="body1" gutterBottom>
        Records for {selectedDisease}
      </Typography>
        <Box sx={{ '& thead': { display: 'none' } }}>
          <OtTable
            // showGlobalFilter
            columns={columns}
            rows={records}
            // dataDownloader
            // dataDownloaderFileStem="clinical-records"
            // fixed
            noWrapHeader={false}
            rowsPerPageOptions={defaultRowsPerPageOptions}
            // loading={loading}
            showGlobalFilter={false}
            hover
            showColumnVisibilityControl={false}
          />
        </Box>
    </>
  );
}

export default RecordsCards;