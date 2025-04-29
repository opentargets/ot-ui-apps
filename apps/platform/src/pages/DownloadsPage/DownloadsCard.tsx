import { Box, Button, Card, CardActions, CardContent, Chip, Typography } from "@mui/material";
import { buildSchema } from "./utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faDatabase } from "@fortawesome/free-solid-svg-icons";
import DownloadsSchemaDrawer from "./DownloadsSchemaDrawer";
import { LongText } from "ui";
import DownloadsSchemaDialog from "./DownloadsSchemaDialog";
import DownloadsAccessOptionsDialog from "./DownloadsAccessOptionsDialog";

const FORMAT_MAPPING = {
  "application/x-parquet": "Parquet",
};

function DownloadsCard({ data, schemaRow, version, locationUrl }) {
  const columnId = data["@id"];
  // const containedInArray = Array.isArray(containedIn) ? containedIn : [containedIn];

  return (
    <Card
      sx={{
        width: "350px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "none",
        border: theme => `1px solid ${theme.palette.grey[300]}`,
        mb: 3,
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
            <Chip variant="outlined" label={data.categories.join(",")} size="small" />
          </Box>

          <LongText variant="body1" lineLimit={2}>
            {data.description}
          </LongText>
          <br />
          <Typography component="span" sx={{ color: "text.secondary", mb: 1.5 }}>
            <Chip size="small" color="primary" label={FORMAT_MAPPING[data.encodingFormat]} />
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mb: 1.5,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span> Last Updated on: </span>
            <span> date </span>
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ display: "flex", width: 1, pb: 2, px: 2 }}>
        <Box sx={{ width: "50%" }}>
          <DownloadsSchemaDialog schemaRow={schemaRow}>
            <Button
              variant="outlined"
              color="primary"
              sx={{ width: "100%" }}
              startIcon={<FontAwesomeIcon icon={faCode} size="sm" />}
            >
              {" "}
              Schema
            </Button>
          </DownloadsSchemaDialog>
        </Box>
        <Box sx={{ width: "50%" }}>
          <DownloadsAccessOptionsDialog data={data} version={version} locationUrl={locationUrl}>
            <Button
              variant="outlined"
              color="primary"
              sx={{ width: "100%" }}
              startIcon={<FontAwesomeIcon icon={faDatabase} size="sm" />}
            >
              {" "}
              Access Data
            </Button>
          </DownloadsAccessOptionsDialog>
        </Box>
      </CardActions>
    </Card>
  );
}
export default DownloadsCard;
