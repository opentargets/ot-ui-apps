import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { makeStyles } from "@mui/styles";

type ClinvarStarsProps = {
  num: number;
  length?: number;
};

const useStyles = makeStyles((theme) => ({
  star: {
    color: theme.palette.primary.main,
  },
}));

function ClinvarStars({ num, length = 4 }: ClinvarStarsProps) {
  const classes = useStyles();

  const stars = [];
  for (let i = 0; i < length; i++) {
    stars.push(
      <FontAwesomeIcon key={i} className={classes.star} icon={num > i ? faStarSolid : faStar} />
    );
  }

  return stars;
}

export default ClinvarStars;
