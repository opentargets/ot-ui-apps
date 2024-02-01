import { makeStyles } from "@mui/styles";
import { Box, CircularProgress } from "@mui/material";

type LoadingBackdropProps = {
  height?: number;
};

const useStyles = makeStyles(theme => ({
  container: {
    color: theme.palette.primary.main,
    background: theme.palette.grey["50"],
    zIndex: 999,
    width: "auto",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
}));

function LoadingBackdrop({ height }: LoadingBackdropProps) {
  const classes = useStyles();
  const containerHeight = height ? `${height}px` : "auto";
  return (
    <Box className={classes.container} sx={{ height: containerHeight }}>
      <CircularProgress color="inherit" />
    </Box>
  );
}

export default LoadingBackdrop;
