import { makeStyles, useTheme } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import { Highlights, Link, DisplayVariantId } from "ui";

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: "30px",
  },
  subtitle: {
    fontSize: "20px",
    fontWeight: 500,
  },
  icon: {
    color: theme.palette.primary.main,
  },
}));

function VariantResult({ data, highlights }) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.container}>
      <Link to={`/variant/${data.id}`} className={classes.subtitle}>
        <FontAwesomeIcon icon={faMapPin} />{" "}
        <DisplayVariantId
          variantId={data.id}
          referenceAllele={data.referenceAllele}
          alternateAllele={data.alternateAllele}
          expand={false}
        />
      </Link>
      <Highlights highlights={highlights} />
    </div>
  );
}

export default VariantResult;