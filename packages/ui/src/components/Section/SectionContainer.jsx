import { Grid } from "@material-ui/core";
import { NavPanel } from "../NavPanel";

function SectionContainer({ children }) {
  return (
    <>
      {/* TODO: Pass down the correct sections */}
      <NavPanel sections={[]} />
      <Grid
        id="summary-section"
        container
        spacing={2}
        style={{ marginTop: "20px" }}
      >
        {children}
      </Grid>
    </>
  );
}

export default SectionContainer;
