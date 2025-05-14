import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import { DisplayVariantId, Highlights, Link, LongText } from "ui";

const useStyles = makeStyles((theme) => ({
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
  const _theme = useTheme();

  return (
    <div className={classes.container}>
      <Link to={`/variant/${data.id}`} className={classes.subtitle}>
        <FontAwesomeIcon icon={faMapPin} className={classes.icon} />{" "}
        <DisplayVariantId
          variantId={data.id}
          referenceAllele={data.referenceAllele}
          alternateAllele={data.alternateAllele}
          expand={false}
        />
      </Link>

      <Typography variant="body2" component="div">
        <LongText lineLimit={4}>{data.variantDescription}</LongText>
      </Typography>
      {data.rsIds.length > 0 && (
        <Typography variant="body2">Ensembl: {data.rsIds.join(", ")}</Typography>
      )}
      <Highlights highlights={highlights} />
    </div>
  );
}

export default VariantResult;
