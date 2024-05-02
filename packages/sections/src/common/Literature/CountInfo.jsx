import { InputLabel, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLiterature } from "./LiteratureContext";

const useStyles = makeStyles(() => ({
  resultCount: {
    // marginLeft: "2rem",
    // marginRight: "6rem",
  },
}));

function CountInfo() {
  const { pageSize, litsCount, loadingEntities } = useLiterature();
  const classes = useStyles();
  const getLabelText = () => {
    if (loadingEntities) return "Loading count...";
    return `Showing ${
      litsCount > pageSize ? pageSize : litsCount} of ${litsCount} results`;
  };

  return (
    <Box sx={{ mt: 4, mr: 3 }}>
      <InputLabel className={classes.resultCount}>{getLabelText()}</InputLabel>
    </Box>
  );
}

export default CountInfo;