import { Box, Checkbox, FormControlLabel, FormGroup, Paper, Typography } from "@mui/material";
import { v1 } from "uuid";

function DownloadsFilter({ categories }) {
  return (
    <Paper variant="outlined" elevation={0}>
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ wordBreak: "break-all", fontWeight: "bold", mb: 2 }}
        >
          Filters
        </Typography>
        <Typography variant="subtitle1" component="div" sx={{ fontWeight: "bold" }}>
          Data Categories
        </Typography>
        <FormGroup>
          {categories.map(e => (
            <FormControlLabel key={v1()} control={<Checkbox />} label={e} />
          ))}
          {/* <FormControlLabel control={<Checkbox />} label="Genomic Data" />
          <FormControlLabel control={<Checkbox />} label="Pharmacological Data" />
          <FormControlLabel control={<Checkbox />} label="Clinical Data" />
          <FormControlLabel control={<Checkbox />} label="Evidence Data" />
          <FormControlLabel control={<Checkbox />} label="Ontology Data" /> */}
        </FormGroup>
      </Box>
    </Paper>
  );
}
export default DownloadsFilter;
