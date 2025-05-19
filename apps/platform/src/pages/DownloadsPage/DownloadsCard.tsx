import { Box, Button, Card, CardActions, CardContent, Chip, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faDatabase } from "@fortawesome/free-solid-svg-icons";
import { OtLongText } from "ui";
import DownloadsSchemaDialog from "./DownloadsSchemaDialog";
import DownloadsAccessOptionsDialog from "./DownloadsAccessOptionsDialog";
import { v1 } from "uuid";
import { DownloadsContext } from "./context/DownloadsContext";
import { useContext } from "react";
import { setActiveFilter } from "./context/downloadsActions";

function DownloadsCard({ data, locationUrl }) {
  const { state, dispatch } = useContext(DownloadsContext);

  function handleChangeFilter(e) {
    const currentFilters = [...state.selectedFilters];
    if (currentFilters.includes(e.target.innerText)) {
      return;
    } else {
      currentFilters.push(e.target.innerText);
      dispatch(setActiveFilter(currentFilters));
    }
  }

  function hasCategories() {
    // check if object has categories
    if (data.hasOwnProperty("categories") && data.categories.length) return true;
    return false;
  }

  return (
    <Card
      sx={{
        width: "350px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "none",
        border: theme => `1px solid ${theme.palette.grey[300]}`,
        "&:hover": {
          boxShadow: theme => theme.boxShadow.lg,
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: 1,
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "space-between",
              mb: 1,
              gap: 1,
            }}
          >
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
              {data.name}
            </Typography>
          </Box>

          <OtLongText variant="body2" lineLimit={2} displayText="... more">
            {data.description}
          </OtLongText>
        </Box>

        <Box>
          <Box sx={{ display: "flex", gap: 1, my: 1 }}>
            {hasCategories() &&
              data.categories.map(c => (
                <Chip
                  key={v1()}
                  size="small"
                  label={c}
                  clickable
                  onClick={handleChangeFilter}
                  sx={{ background: theme => theme.palette.primary.dark, color: "white" }}
                />
              ))}
          </Box>
        </Box>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          width: 1,
          pb: 3,
          px: 2,
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ width: { xs: "100%", sm: "45%" }, m: { xs: "0 !important" } }}>
          <DownloadsSchemaDialog currentRowId={data["@id"]}>
            <Button variant="outlined" color="primary" sx={{ width: "100%", gap: 2 }}>
              <FontAwesomeIcon icon={faCode} />
              Schema
            </Button>
          </DownloadsSchemaDialog>
        </Box>
        <Box sx={{ width: { xs: "100%", sm: "45%" }, m: { xs: "0 !important" } }}>
          <DownloadsAccessOptionsDialog
            data={data}
            version={state.downloadsData?.version}
            locationUrl={locationUrl}
          >
            <Button variant="outlined" color="primary" sx={{ width: "100%", gap: 2 }}>
              <FontAwesomeIcon icon={faDatabase} />
              Access Data
            </Button>
          </DownloadsAccessOptionsDialog>
        </Box>
      </CardActions>
    </Card>
  );
}
export default DownloadsCard;
