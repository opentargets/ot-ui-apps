import { Grid, Paper, Box } from "@mui/material";
import config from "../../config";

import OTLogo from "../../assets/OTLogo";
import PPOTLogo from "../../assets/PPPOTLogo";

const styles = {
  homeboxContainer: {
    overflow: "visible",
    padding: "90px 80px 90px",
    maxWidth: "900px",
    margin: "auto",
    backround: "#000003",
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
      <Paper elevation={3} sx={styles.homeboxContainer}>
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
