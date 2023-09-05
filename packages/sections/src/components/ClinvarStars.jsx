import { makeStyles } from "@mui/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-regular-svg-icons";

const useStyles = makeStyles((theme) => ({
  star: {
    color: theme.palette.primary.main,
  },
}));

function ClinvarStars({ num, length = 4 }) {
  const classes = useStyles();

  const stars = [];
  let starNum = num;
  for (let i = 0; i < length; i++) {
    stars.push(
      <FontAwesomeIcon
        key={i}
        className={starNum > 0 ? classes.star : ""}
        icon={starNum > 0 ? faStarSolid : faStar}
      />
    );
    starNum = -1;
  }

  return stars;
}

export default ClinvarStars;
