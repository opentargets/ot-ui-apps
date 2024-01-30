import { Grid, Paper, Box } from "@mui/material";
import config from "../../config";

import OTLogo from "../../assets/OTLogo";
import PPOTLogo from "../../assets/PPPOTLogo";

const styles = {
  homeboxContainer: {
    overflow: "visible",
    padding: "30px 60px",
    maxWidth: "800px",
    margin: "auto",
  },
  homeboxHeader: {
    textAlign: "center",
    marginBottom: "20px",
  },
  logo: {
    maxWidth: "30rem",
    width: "100%",
  },
};

function HomeBox({ children }) {
  return (
    <Grid item xs={12} sm={8} md={8} lg={8}>
      <Paper sx={styles.homeboxContainer}>
        <Box sx={styles.homeboxHeader}>
          {config.profile.isPartnerPreview ? (
            <PPOTLogo sx={styles.logo} />
          ) : (
            <OTLogo sx={styles.logo} />
          )}
        </Box>
        {children}
      </Paper>
    </Grid>
  );
}

export default HomeBox;
