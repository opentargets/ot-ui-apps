import { useState } from "react";
import { makeStyles } from "@mui/styles";

import Link from "../Link";

const useStyles = makeStyles(theme => ({
  showMore: {
    color: theme.palette.primary.main,
    cursor: "pointer",
  },
}));

type XRefLinksProps = {
  label: string;
  urlStem: string;
  ids: string[];
  limit: number;
};

function XRefLinks({ label, urlStem, ids, limit }: XRefLinksProps) {
  const [showMore, setShowMore] = useState(false);
  const classes = useStyles();
  const displayNone = {
    display: "none",
  };

  return (
    <span>
      {label}:{" "}
      {ids.map((id, i) => (
        <span key={id} style={i > limit - 1 && !showMore ? displayNone : {}}>
          <Link external to={`${urlStem}${id}`}>
            {id}
            {i < ids.length - 1 ? ", " : ""}
          </Link>
        </span>
      ))}
      {ids.length > limit ? (
        <span>
          {showMore ? "" : "... "}[{" "}
          <span className={classes.showMore} onClick={() => setShowMore(!showMore)}>
            {showMore ? " hide" : " show more"}
          </span>{" "}
          ]
        </span>
      ) : null}
    </span>
  );
}

export default XRefLinks;
