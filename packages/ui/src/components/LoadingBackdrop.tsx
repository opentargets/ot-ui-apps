import { makeStyles } from "@mui/styles";
import { Box, CircularProgress } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  container: {
    color: theme.palette.primary.main,
    background: theme.palette.grey["50"],
    zIndex: 999,
    width: "auto",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
}));

function LoadingBackdrop() {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <CircularProgress color="inherit" />
    </Box>
  );
}

export default LoadingBackdrop;
