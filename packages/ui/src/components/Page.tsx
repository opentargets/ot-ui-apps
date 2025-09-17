import { Theme, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ReactElement } from "react";

const useStyles = makeStyles((theme: Theme) => ({
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
  children: ReactElement;
  footer: ReactElement;
  header: ReactElement;
};

function Page({ header, footer, children }: PageProps) {
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

export { Page };

export default Page;
