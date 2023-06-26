import { Grid } from "@material-ui/core";

import { NavPanel } from "../NavPanel";

function SectionContainer({ children }) {
  return (
    <>
      <NavPanel sections={[]} />
      <Grid id="summary-section" container spacing={1}>
        {/* {sortedChildren.map(Section =>
          shouldRender(Section) ? Section : null
        )} */}
        {children}
      </Grid>
    </>
  );
}

export default SectionContainer;
