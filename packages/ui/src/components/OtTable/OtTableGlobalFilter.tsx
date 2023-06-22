import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, Input, InputAdornment, makeStyles } from "@material-ui/core";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(() => ({
  searchAllColumn: {
    width: "100%",
  },
}));

type OtTableGlobalFilterProps = {
  globalFilter: string;
  onGlobalFilterSearch: (e) => void;
};

function OtTableGlobalFilter({
  globalFilter = "",
  onGlobalFilterSearch = (e) => ({}),
}: OtTableGlobalFilterProps) {
  const classes = useStyles();

  return (
    <>
      <Grid container>
        <Grid item xs={12} lg={4}>
          <Input
            className={classes.searchAllColumn}
            value={globalFilter ?? ""}
            onChange={onGlobalFilterSearch}
            placeholder="Search all columns..."
            startAdornment={
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </InputAdornment>
            }
          />
        </Grid>
      </Grid>
    </>
  );
}

export default OtTableGlobalFilter;
