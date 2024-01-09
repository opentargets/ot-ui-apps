import { makeStyles } from "@mui/styles";
import { Grid } from "@mui/material";
import { ReactNode } from "react";

const useStyles = makeStyles(theme => ({
  page: {
    background: theme.palette.grey["50"],
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    margin: 0,
    width: "100%",
  },
  gridContainer: {
    margin: 0,
    padding: "24px",
    width: "100%",
    flex: "1 0 auto",
  },
}));

type PageProps = {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
};

function Page({ header, footer, children }: PageProps): ReactNode {
  const classes = useStyles();
  return (
    <div className={classes.page}>
      {header}
      <Grid container justifyContent="center" spacing={3} className={classes.gridContainer}>
        <Grid item xs={12} md={11} sx={{ pb: 3 }}>
          {children}
        </Grid>
      </Grid>
      {footer}
    </div>
  );
}

export default Page;
