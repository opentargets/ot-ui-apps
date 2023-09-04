import { Grid } from "@material-ui/core";

function SectionContainer({ children }) {
  return (
    <Grid
      id="summary-section"
      container
      spacing={2}
      style={{ marginTop: "20px" }}
    >
      {children}
    </Grid>
  );
}

export default SectionContainer;
