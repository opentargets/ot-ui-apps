import { Box, Button, Card, CardActions, CardContent, Chip, Grid, Typography } from "@mui/material";
import { buildSchema } from "./utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faDatabase } from "@fortawesome/free-solid-svg-icons";
import DownloadsSchemaDrawer from "./DownloadsSchemaDrawer";
import { LongText } from "ui";

function DownloadsCard({ data }) {
  const columnId = data["@id"];
  // const containedInArray = Array.isArray(containedIn) ? containedIn : [containedIn];

  function showSchema() {
    console.log(columnId);
    console.log(buildSchema(data));
  }
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
        mb: 2,
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
            <Typography
              variant="h6"
              component="div"
              sx={{ wordBreak: "break-all", fontWeight: "bold" }}
            >
              {data.name}
            </Typography>
            <Chip variant="outlined" label="category" size="small" />
          </Box>

          <LongText variant="body1" lineLimit={2}>
            {data.description}
          </LongText>
          <br />
          <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
            <Chip size="small" color="primary" label="dataType" />
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
      <CardActions sx={{ display: "flex", width: 1 }}>
        <Box sx={{ width: "50%" }}>
          {/* <DownloadsSchemaDrawer data={data}> */}
          <Button
            variant="outlined"
            color="primary"
            sx={{ width: "100%" }}
            startIcon={<FontAwesomeIcon icon={faCode} size="sm" />}
          >
            {" "}
            Schema
          </Button>
          {/* </DownloadsSchemaDrawer> */}
        </Box>
        <Box sx={{ width: "50%" }}>
          <Button
            variant="contained"
            sx={{
              width: "100%",
              color: "white",
              background: theme => theme.palette.primary.dark,
              border: "none",
            }}
            startIcon={<FontAwesomeIcon icon={faDatabase} color="primary" />}
          >
            Access Option
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}
export default DownloadsCard;
