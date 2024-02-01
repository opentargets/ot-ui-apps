import { InputLabel, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useRecoilValue } from "recoil";
import { litsCountState, loadingEntitiesState, tablePageSizeState } from "./atoms";

const useStyles = makeStyles(() => ({
  resultCount: {
    // marginLeft: "2rem",
    // marginRight: "6rem",
  },
}));

function CountInfo() {
  const classes = useStyles();
  const pageSize = useRecoilValue(tablePageSizeState);
  const count = useRecoilValue(litsCountState);
  const loadingEntities = useRecoilValue(loadingEntitiesState);

  const getLabelText = () => {
    if (loadingEntities) return "Loading count...";
    return `Showing ${count > pageSize ? pageSize : count} of ${count} results`;
  };

  return (
    <Box sx={{ mt: 4, mr: 3 }}>
      <InputLabel className={classes.resultCount}>{getLabelText()}</InputLabel>
    </Box>
  );
}

export default CountInfo;
